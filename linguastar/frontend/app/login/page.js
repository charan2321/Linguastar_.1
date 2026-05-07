'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'

export default function Login() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [sent, setSent] = useState(false)

    const handleLogin = async () => {
        try {
            setLoading(true)
            setMessage('')

            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            })

            if (error) {
                setMessage(error.message)
            } else {
                setSent(true)
                setMessage('Check your email for the magic link!')
            }
        } catch {
            setMessage('An unexpected error occurred. Please try again.')
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

                    {sent ? (
                        // ===== SUCCESS STATE =====
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '72px', height: '72px', borderRadius: '50%',
                                background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '2rem', margin: '0 auto 24px',
                                animation: 'float 3s ease-in-out infinite',
                            }}>
                                ✉️
                            </div>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px' }}>Check your inbox</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '8px', fontSize: '0.95rem' }}>
                                We sent a magic link to
                            </p>
                            <p style={{ fontWeight: '600', color: 'var(--accent-light)', marginBottom: '28px', wordBreak: 'break-all' }}>
                                {email}
                            </p>
                            <button
                                onClick={() => { setSent(false); setEmail(''); setMessage(''); }}
                                className="btn-secondary"
                                style={{ width: '100%' }}
                            >
                                Use different email
                            </button>
                        </div>
                    ) : (
                        // ===== LOGIN FORM =====
                        <>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                                Sign in
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '32px' }}>
                                Enter your email to receive a magic link
                            </p>

                            {/* Email Input */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    id="email-input"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && !loading && email && handleLogin()}
                                    className="input-dark"
                                />
                            </div>

                            {/* Error / Info Message */}
                            {message && !sent && (
                                <div style={{
                                    padding: '12px 16px',
                                    borderRadius: '10px',
                                    background: 'rgba(239,68,68,0.08)',
                                    border: '1px solid rgba(239,68,68,0.2)',
                                    color: '#f87171',
                                    fontSize: '0.85rem',
                                    marginBottom: '16px',
                                }}>
                                    ⚠️ {message}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                id="send-otp-btn"
                                onClick={handleLogin}
                                disabled={loading || !email}
                                className="btn-primary"
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    opacity: loading || !email ? 0.6 : 1,
                                    cursor: loading || !email ? 'not-allowed' : 'pointer',
                                    marginTop: '4px',
                                }}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                                        Sending...
                                    </>
                                ) : (
                                    '✨ Send Magic Link'
                                )}
                            </button>

                            {/* Divider */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>no password needed</span>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                            </div>

                            {/* Back to store */}
                            <div style={{ textAlign: 'center' }}>
                                <Link href="/store" className="btn-ghost" style={{ width: '100%', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                                    Browse Store without signing in →
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer text */}
                <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: '1.6' }}>
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    )
}