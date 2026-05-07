import Razorpay from 'razorpay'
import { NextResponse } from 'next/server'

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // ✅ FIXED
    key_secret: process.env.RAZORPAY_KEY_SECRET // ✅ FIXED
})

export async function POST(req) {
    try {
        const { amount } = await req.json()

        if (!amount) {
            return NextResponse.json(
                { error: 'Amount required' },
                { status: 400 }
            )
        }

        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        })

        if (!order) {
            return NextResponse.json(
                { error: 'Order creation failed' },
                { status: 500 }
            )
        }

        return NextResponse.json(order)

    } catch (err) {
        console.error('RAZORPAY ERROR:', err)

        return NextResponse.json(
            { error: 'Order failed' },
            { status: 500 }
        )
    }
}