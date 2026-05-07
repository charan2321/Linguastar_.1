import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../services/supabaseAdmin'

export async function POST(req) {
    try {
        const formData = await req.formData()

        const file = formData.get('file')
        const title = formData.get('title')
        const price = formData.get('price')

        if (!file || !title || !price) {
            return NextResponse.json(
                { error: 'All fields required' },
                { status: 400 }
            )
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json(
                { error: 'Only PDF allowed' },
                { status: 400 }
            )
        }

        const filePath = `books/${Date.now()}-${file.name}`

        const { error: uploadError } = await supabaseAdmin
            .storage
            .from('books')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error(uploadError)

            return NextResponse.json(
                { error: uploadError.message },
                { status: 500 }
            )
        }

        const { error: dbError } = await supabaseAdmin
            .from('books')
            .insert([
                {
                    title,
                    price: Number(price),
                    file_path: filePath
                }
            ])

        if (dbError) {
            console.error(dbError)

            return NextResponse.json(
                { error: dbError.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true
        })

    } catch (err) {
        console.error(err)

        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        )
    }
}