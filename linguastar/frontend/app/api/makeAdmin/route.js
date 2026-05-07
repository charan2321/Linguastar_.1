import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req) {
    try {
        const { user_id, password } = await req.json()

        // Verify the secret admin password
        if (password !== '14021') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!user_id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        // Initialize Supabase admin client to bypass RLS
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        )

        // Check if user is already an admin
        const { data: existingAdmin } = await supabaseAdmin
            .from('admins')
            .select('*')
            .eq('user_id', user_id)
            .single()

        if (!existingAdmin) {
            // Insert into admins table
            const { error: insertError } = await supabaseAdmin
                .from('admins')
                .insert([{ user_id }])

            if (insertError) {
                console.error('Error making user admin:', insertError)
                return NextResponse.json({ error: 'Failed to insert admin' }, { status: 500 })
            }
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Make Admin Error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
