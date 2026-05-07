import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../services/supabaseAdmin'

export async function POST(req) {

    try {

        const secret = process.env.RAZORPAY_WEBHOOK_SECRET

        const body = await req.text()

        const signature =
            req.headers.get('x-razorpay-signature')

        // =========================================
        // VERIFY WEBHOOK SIGNATURE
        // =========================================

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex')

        if (expectedSignature !== signature) {

            return NextResponse.json(
                { error: 'Invalid webhook signature' },
                { status: 400 }
            )
        }

        const payload = JSON.parse(body)

        // =========================================
        // PAYMENT CAPTURED
        // =========================================

        if (
            payload.event === 'payment.captured'
        ) {

            const payment =
                payload.payload.payment.entity

            const notes = payment.notes || {}

            const user_id = notes.user_id
            const book_id = notes.book_id

            if (!user_id || !book_id) {

                return NextResponse.json(
                    { error: 'Missing notes' },
                    { status: 400 }
                )
            }

            // =========================================
            // EXPIRY
            // =========================================

            const expiry = new Date()

            expiry.setDate(
                expiry.getDate() + 60
            )

            // =========================================
            // CHECK EXISTING
            // =========================================

            const { data: existing } = await supabaseAdmin
                .from('purchases')
                .select('*')
                .eq('user_id', user_id)
                .eq('book_id', book_id)
                .single()

            if (existing) {

                await supabaseAdmin
                    .from('purchases')
                    .update({
                        payment_id: payment.id,
                        expiry_date: expiry.toISOString()
                    })
                    .eq('id', existing.id)

            } else {

                await supabaseAdmin
                    .from('purchases')
                    .insert([
                        {
                            user_id,
                            book_id,
                            payment_id: payment.id,
                            expiry_date:
                                expiry.toISOString()
                        }
                    ])
            }
        }

        return NextResponse.json({
            success: true
        })

    } catch (err) {

        console.error(err)

        return NextResponse.json(
            { error: 'Webhook failed' },
            { status: 500 }
        )
    }
}