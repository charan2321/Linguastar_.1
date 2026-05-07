'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function ResetPassword() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)
    const [isSessionReady, setIsSessionReady] = useState(false)

    useEffect(() => {
        // Wait for Supabase to parse the URL hash fragment and establish the session
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setIsSessionReady(true)
            } else {
                const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                    if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') {
                        setIsSessionReady(true)
                    }
                })
                
                // If no session after 3 seconds, they probably don't have a valid reset token
                setTimeout(() => {
                    if (!isSessionReady) {
                        setMessage('Invalid or expired reset link. Please try again.')
                    }
                }, 3000)

                return () => subscription?.unsubscribe()
            }
        }
        checkSession()
    }, [isSessionReady])

    const handleUpdate = async (e) => {
        if (e) e.preventDefault()
        if (!password) return

        try {
            setLoading(true)
            setMessage('')
            setIsSuccess(false)

            const { error } = await supabase.auth.updateUser({ password })

            if (error) throw error

            setIsSuccess(true)
            setMessage('Password updated successfully! Redirecting...')
            setTimeout(() => router.push('/dashboard'), 1500)
        } catch (err) {
            setMessage(err.message || 'An unexpected error occurred.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* BG Orbs */}
            <div className="orb orb-purple" style={{ width: '500px', height: '500px', top: '-200px', left: '-200px', opacity: 0.3 }} />
            <div className="orb orb-pink" style={{ width: '400px', height: '400px', bottom: '-100px', right: '-100px', opacity: 0.2 }} />

            <div style={{
                width: '100%',
                maxWidth: '420px',
                position: 'relative',
                zIndex: 1,
                animation: 'fadeInUp 0.5s ease',
            }}>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '22px', boxShadow: '0 0 24px rgba(124,58,237,0.5)',
                        }}>
                            ✦
                        </div>
                        <span style={{
                            fontSize: '1.4rem', fontWeight: '800',
                            background: 'linear-gradient(135deg, #f1f0ff, #a78bfa)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>
                            Linguastar
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div className="glass" style={{ padding: '40px', borderRadius: '24px' }}>

                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                        Create New Password
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '32px' }}>
                        Enter your new password below to regain access.
                    </p>

                    {!isSessionReady && !message ? (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div className="spinner" style={{ width: '24px', height: '24px', margin: '0 auto 12px' }} />
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Verifying secure link...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdate}>
                            {/* Password Input */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="input-dark"
                                    required
                                    suppressHydrationWarning
                                    disabled={!isSessionReady}
                                />
                            </div>

                            {/* Error / Info Message */}
                            {message && (
                                <div style={{
                                    padding: '12px 16px',
                                    borderRadius: '10px',
                                    background: isSuccess ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                                    border: `1px solid ${isSuccess ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                                    color: isSuccess ? '#4ade80' : '#f87171',
                                    fontSize: '0.85rem',
                                    marginBottom: '20px',
                                }}>
                                    {isSuccess ? '✅ ' : '⚠️ '}{message}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || !password || !isSessionReady}
                                className="btn-primary"
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    opacity: loading || !password || !isSessionReady ? 0.6 : 1,
                                    cursor: loading || !password || !isSessionReady ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </form>
                    )}

                </div>
            </div>
        </div>
    )
}
