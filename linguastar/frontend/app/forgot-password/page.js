'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)

    const handleReset = async (e) => {
        if (e) e.preventDefault()
        if (!email) return

        try {
            setLoading(true)
            setMessage('')
            setIsSuccess(false)

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })

            if (error) throw error

            setIsSuccess(true)
            setMessage('Password reset link sent! Check your email.')
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

                    {isSuccess ? (
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
                                We sent a password reset link to
                            </p>
                            <p style={{ fontWeight: '600', color: 'var(--accent-light)', marginBottom: '28px', wordBreak: 'break-all' }}>
                                {email}
                            </p>
                            <button
                                onClick={() => { setIsSuccess(false); setEmail(''); setMessage(''); }}
                                className="btn-secondary"
                                style={{ width: '100%' }}
                            >
                                Try another email
                            </button>
                        </div>
                    ) : (
                        <>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                                Reset Password
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '32px' }}>
                                Enter your email and we'll send you a link to reset your password.
                            </p>

                            <form onSubmit={handleReset}>
                                {/* Email Input */}
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="input-dark"
                                        required
                                        suppressHydrationWarning
                                    />
                                </div>

                                {/* Error / Info Message */}
                                {message && (
                                    <div style={{
                                        padding: '12px 16px',
                                        borderRadius: '10px',
                                        background: 'rgba(239,68,68,0.08)',
                                        border: '1px solid rgba(239,68,68,0.2)',
                                        color: '#f87171',
                                        fontSize: '0.85rem',
                                        marginBottom: '20px',
                                    }}>
                                        ⚠️ {message}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !email}
                                    className="btn-primary"
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        opacity: loading || !email ? 0.6 : 1,
                                        cursor: loading || !email ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </button>
                            </form>
                        </>
                    )}

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                    </div>

                    {/* Back to Login */}
                    <div style={{ textAlign: 'center' }}>
                        <Link href="/login" className="btn-ghost" style={{ width: '100%', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                            ← Back to Sign In
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}
