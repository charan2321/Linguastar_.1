'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Dashboard() {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const {
                    data: { user }
                } = await supabase.auth.getUser()

                if (!user) {
                    alert('Please login first')
                    return
                }

                const { data, error } = await supabase
                    .from('purchases')
                    .select(`
            id,
            expiry_date,
            books (
              id,
              title,
              price
            )
          `)
                    .eq('user_id', user.id)

                if (error) {
                    console.error(error)
                    return
                }

                setBooks(data || [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        loadBooks()
    }, [])

    const getDaysLeft = (expiry) => {
        const now = new Date()
        const exp = new Date(expiry)

        const diff = exp - now

        return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0)
    }

    if (loading) {
        return <div className="p-10">Loading...</div>
    }

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">📚 My Books</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((item) => (
                    <div
                        key={item.id}
                        className="border rounded-xl p-5 shadow bg-white"
                    >
                        <h2 className="text-xl font-semibold">
                            {item.books?.title}
                        </h2>

                        <p className="text-gray-500 mt-2">
                            ₹{item.books?.price}
                        </p>

                        <p className="mt-2 text-sm">
                            ⏳ {getDaysLeft(item.expiry_date)} days left
                        </p>

                        <a href={`/reader/${item.books?.id}`}>
                            <button className="mt-4 bg-black text-white px-4 py-2 rounded">
                                Read Book
                            </button>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}