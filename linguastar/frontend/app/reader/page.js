'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function ReaderPage() {
    const params = useSearchParams()
    const router = useRouter()
    const bookId = params.get('bookId')

    const [url, setUrl] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const loadBook = async () => {
            try {
                // 1. Check session
                const { data } = await supabase.auth.getSession()

                if (!data?.session) {
                    alert('Session expired. Please login.')
                    router.push('/login')
                    return
                }

                const token = data.session.access_token

                // 2. Call secure API
                const res = await fetch('/api/getBookAccess', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ bookId })
                })

                const result = await res.json()

                if (!res.ok) {
                    throw new Error(result.error || 'Access denied')
                }

                setUrl(result.url)

            } catch (err) {
                alert(err.message)
                router.push('/test')
            } finally {
                setLoading(false)
            }
        }

        if (bookId) loadBook()

    }, [bookId, router])

    if (loading) return <p style={{ padding: 20 }}>Loading book...</p>
    if (!url) return <p style={{ padding: 20 }}>Failed to load book</p>

    return (
        <div style={{ height: '100vh', background: '#000' }}>
            <iframe
                src={url}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
            />
        </div>
    )
}