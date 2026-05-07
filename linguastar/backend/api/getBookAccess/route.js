import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../services/supabaseAdmin'

export async function POST(req) {
  try {
    const { bookId } = await req.json()

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    const { data: { user } } = await supabaseAdmin.auth.getUser(token)

    if (!user) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 403 })
    }

    const { data: purchase } = await supabaseAdmin
      .from('purchases')
      .select('expiry_date')
      .eq('user_id', user.id)
      .eq('book_id', bookId)
      .single()

    if (!purchase) {
      return NextResponse.json({ error: 'No purchase found' }, { status: 403 })
    }

    // ✅ EXPIRY CHECK
    if (new Date(purchase.expiry_date) < new Date()) {
      return NextResponse.json({ error: 'Access expired' }, { status: 403 })
    }

    const { data: book } = await supabaseAdmin
      .from('books')
      .select('file_path')
      .eq('id', bookId)
      .single()

    const { data } = await supabaseAdmin
      .storage
      .from('books')
      .createSignedUrl(book.file_path, 60)

    return NextResponse.json({ url: data.signedUrl })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}