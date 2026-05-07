'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Store() {

    const [books, setBooks] = useState([])
    const [user, setUser] = useState(null)

    useEffect(() => {

        const init = async () => {

            const {
                data: { user }
            } = await supabase.auth.getUser()

            setUser(user)

            const { data } = await supabase
                .from('books')
                .select('*')

            setBooks(data || [])
        }

        init()

    }, [])

    // =========================================
    // BUY BOOK
    // =========================================

    const handleBuy = async (book) => {

        try {

            if (!user) {
                alert('Login first')
                return
            }

            // =========================================
            // CREATE ORDER
            // =========================================

            const res = await fetch('/api/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: book.price
                })
            })

            const order = await res.json()

            if (!order.id) {
                alert('Order creation failed')
                return
            }

            // =========================================
            // RAZORPAY OPTIONS
            // =========================================

            const options = {

                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

                amount: order.amount,

                currency: 'INR',

                name: 'Book Store',

                description: book.title,

                order_id: order.id,

                theme: {
                    color: '#000000'
                },

                handler: async function (response) {

                    try {

                        // =========================================
                        // VERIFY + SAVE PURCHASE
                        // =========================================

                        const saveRes = await fetch('/api/savePurchase', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({

                                user_id: user.id,

                                book_id: book.id,

                                razorpay_order_id:
                                    response.razorpay_order_id,

                                razorpay_payment_id:
                                    response.razorpay_payment_id,

                                razorpay_signature:
                                    response.razorpay_signature
                            })
                        })

                        const saveData = await saveRes.json()

                        if (!saveRes.ok) {
                            alert(saveData.error || 'Payment verification failed')
                            return
                        }

                        alert('✅ Payment Successful')

                        window.location.href = '/dashboard'

                    } catch (err) {

                        console.error(err)

                        alert('Payment save failed')
                    }
                },

                modal: {
                    ondismiss: function () {
                        console.log('Payment popup closed')
                    }
                }
            }

            // =========================================
            // OPEN RAZORPAY
            // =========================================

            const rzp = new window.Razorpay(options)

            rzp.open()

        } catch (err) {

            console.error(err)

            alert('Something went wrong')
        }
    }

    // =========================================
    // UI
    // =========================================

    return (
        <div className="p-10">

            <h1 className="text-3xl font-bold mb-6">
                📚 Store
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {books.map((book) => (

                    <div
                        key={book.id}
                        className="border p-5 rounded-2xl shadow bg-white"
                    >

                        <h2 className="text-xl font-semibold mb-2">
                            {book.title}
                        </h2>

                        <p className="text-gray-500 mb-4">
                            ₹{book.price}
                        </p>

                        <button
                            onClick={() => handleBuy(book)}
                            className="bg-black text-white px-4 py-2 rounded-lg w-full"
                        >
                            Buy Now
                        </button>

                    </div>

                ))}

            </div>

        </div>
    )
}