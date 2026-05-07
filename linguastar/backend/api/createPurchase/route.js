import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../services/supabaseAdmin'

export async function POST(req) {
    const { bookId } = await req.json()

    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    const { data: { user } } = await supabaseAdmin.auth.getUser(token)

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const expiry = new Date()
    expiry.setDate(expiry.getDate() + 60)

    await supabaseAdmin.from('purchases').insert({
        user_id: user.id,
        book_id: bookId,
        expiry_date: expiry
    })

    return NextResponse.json({ success: true })
}