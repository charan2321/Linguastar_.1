'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

export default function Navbar() {
    const [user, setUser] = useState(null)
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        // Scroll detection
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)

        // Auth state
        supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            window.removeEventListener('scroll', onScroll)
            subscription.unsubscribe()
        }
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    }

    return (
        <nav
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                transition: 'all 0.3s ease',
                ...(scrolled ? {
                    background: 'rgba(6, 7, 13, 0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 4px 40px rgba(0,0,0,0.4)',
                } : {
                    background: 'transparent',
                })
            }}
        >
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 24px',
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>

                {/* Logo */}
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        boxShadow: '0 0 16px rgba(124,58,237,0.5)',
                    }}>
                        ✦
                    </div>
                    <span style={{
                        fontSize: '1.2rem',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #f1f0ff, #a78bfa)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: '-0.02em',
                    }}>
                        Linguastar
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    '@media(maxWidth: 768px)': { display: 'none' }
                }} className="desktop-nav">
                    <NavLink href="/store">Store</NavLink>
                    {user && <NavLink href="/dashboard">Dashboard</NavLink>}
                </div>

                {/* Auth Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {user ? (
                        <>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 12px',
                                background: 'rgba(124,58,237,0.1)',
                                borderRadius: '999px',
                                border: '1px solid rgba(124,58,237,0.25)',
                            }}>
                                <div style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    color: 'white',
                                }}>
                                    {user.email?.[0]?.toUpperCase()}
                                </div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user.email}
                                </span>
                            </div>
                            <button onClick={handleLogout} className="btn-ghost" style={{ fontSize: '0.8rem' }}>
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="btn-ghost">
                                Sign In
                            </Link>
                            <Link href="/store" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
                                Get Started
                            </Link>
                        </>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{
                            display: 'none',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '1.4rem',
                            cursor: 'pointer',
                            padding: '4px',
                        }}
                        className="mobile-menu-btn"
                    >
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div style={{
                    background: 'rgba(6,7,13,0.95)',
                    backdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(255,255,255,0.07)',
                    padding: '16px 24px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                }}>
                    <Link href="/store" onClick={() => setMenuOpen(false)} className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
                        Store
                    </Link>
                    {user && (
                        <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
                            Dashboard
                        </Link>
                    )}
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .desktop-nav { display: none !important; }
                    .mobile-menu-btn { display: flex !important; }
                }
                @media (min-width: 769px) {
                    .mobile-menu-btn { display: none !important; }
                }
            `}</style>
        </nav>
    )
}

function NavLink({ href, children }) {
    return (
        <Link
            href={href}
            style={{
                padding: '8px 16px',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--text-primary)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-secondary)'
                e.currentTarget.style.background = 'transparent'
            }}
        >
            {children}
        </Link>
    )
}
