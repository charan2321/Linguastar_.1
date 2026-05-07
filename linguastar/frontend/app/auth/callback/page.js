'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

export default function AuthCallback() {
    const router = useRouter()
    const [message, setMessage] = useState('Authenticating...')

    useEffect(() => {
        let mounted = true

        const handleAuth = async () => {
            try {
                // Supabase v2 automatically processes the URL fragments (#access_token=...)
                // or query params (?code=...) via the client-side library.
                // We just need to wait for the session to be established.

                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('Session error:', error)
                    if (mounted) {
                        setMessage('Authentication failed. Redirecting...')
                        setTimeout(() => router.push('/login'), 2000)
                    }
                    return
                }

                if (session) {
                    if (mounted) {
                        setMessage('Successfully logged in! Redirecting...')
                        setTimeout(() => router.push('/dashboard'), 1000)
                    }
                } else {
                    // Sometimes getSession takes a moment if it's processing the URL
                    // Listen for the auth state change event which fires when the session is ready
                    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                        if (event === 'SIGNED_IN' && session) {
                            if (mounted) {
                                setMessage('Successfully logged in! Redirecting...')
                                setTimeout(() => router.push('/dashboard'), 1000)
                            }
                        } else if (event === 'SIGNED_OUT') {
                            if (mounted) {
                                setMessage('Authentication failed. Redirecting...')
                                setTimeout(() => router.push('/login'), 2000)
                            }
                        }
                    })

                    // Timeout fallback
                    setTimeout(() => {
                        if (mounted && !session) {
                            router.push('/login')
                        }
                    }, 5000)

                    return () => {
                        subscription?.unsubscribe()
                    }
                }
            } catch (err) {
                console.error('Unexpected error:', err)
                if (mounted) router.push('/login')
            }
        }

        handleAuth()

        return () => {
            mounted = false
        }
    }, [router])

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
            <div className="glass" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center', maxWidth: '400px' }}>
                <div className="spinner" style={{ margin: '0 auto 20px', width: '40px', height: '40px', borderWidth: '3px' }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>{message}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Please wait while we secure your session.</p>
            </div>
        </div>
    )
}