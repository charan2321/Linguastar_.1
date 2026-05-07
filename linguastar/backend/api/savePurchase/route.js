import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../services/supabaseAdmin'

export async function POST(req) {

    try {

        const {
            user_id,
            book_id,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = await req.json()

        // =========================================
        // VALIDATION
        // =========================================

        if (
            !user_id ||
            !book_id ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return NextResponse.json(
                { error: 'Missing payment fields' },
                { status: 400 }
            )
        }

        // =========================================
        // VERIFY RAZORPAY SIGNATURE
        // =========================================

        const body =
            razorpay_order_id + '|' + razorpay_payment_id

        const expectedSignature = crypto
            .createHmac(
                'sha256',
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body.toString())
            .digest('hex')

        const isAuthentic =
            expectedSignature === razorpay_signature

        if (!isAuthentic) {

            return NextResponse.json(
                { error: 'Fake payment detected' },
                { status: 400 }
            )
        }

        // =========================================
        // PURCHASE EXPIRY
        // =========================================

        const expiry = new Date()
        expiry.setDate(expiry.getDate() + 60)

        // =========================================
        // CHECK EXISTING PURCHASE
        // =========================================

        const { data: existing } = await supabaseAdmin
            .from('purchases')
            .select('*')
            .eq('user_id', user_id)
            .eq('book_id', book_id)
            .single()

        // =========================================
        // RENEW EXISTING PURCHASE
        // =========================================

        if (existing) {

            const { error } = await supabaseAdmin
                .from('purchases')
                .update({
                    payment_id: razorpay_payment_id,
                    expiry_date: expiry.toISOString()
                })
                .eq('id', existing.id)

            if (error) {

                return NextResponse.json(
                    { error: error.message },
                    { status: 500 }
                )
            }

            return NextResponse.json({
                success: true,
                renewed: true
            })
        }

        // =========================================
        // CREATE NEW PURCHASE
        // =========================================

        const { error } = await supabaseAdmin
            .from('purchases')
            .insert([
                {
                    user_id,
                    book_id,
                    payment_id: razorpay_payment_id,
                    expiry_date: expiry.toISOString()
                }
            ])

        if (error) {

            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true
        })

    } catch (err) {

        console.error(err)

        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        )
    }
}