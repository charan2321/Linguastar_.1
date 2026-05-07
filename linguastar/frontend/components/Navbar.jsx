'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'

export default function Navbar() {
    const [user, setUser] = useState(null)
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)

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
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    transition: 'background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
                    background: scrolled ? 'rgba(8, 8, 16, 0.88)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(24px)' : 'none',
                    WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                    boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.5)' : 'none',
                }}
            >
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                    {/* ── Logo ── */}
                    <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <motion.div
                            whileHover={{ scale: 1.08, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            style={{
                                width: '34px', height: '34px', borderRadius: '10px',
                                background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '17px', boxShadow: '0 0 20px rgba(124,58,237,0.6)',
                            }}
                        >
                            ✦
                        </motion.div>
                        <span style={{
                            fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.03em',
                            background: 'linear-gradient(135deg, #fff 30%, #a78bfa)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>
                            Linguastar
                        </span>
                    </Link>

                    {/* ── Desktop Links ── */}
                    <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <NavLink href="/store">Store</NavLink>
                        {user && <NavLink href="/dashboard">Library</NavLink>}
                    </div>

                    {/* ── Auth / CTA ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {user ? (
                            <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 12px 5px 6px', borderRadius: '999px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #c026d3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#fff' }}>
                                        {user.email?.[0]?.toUpperCase()}
                                    </div>
                                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {user.email}
                                    </span>
                                </div>
                                <motion.button onClick={handleLogout} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} style={{ padding: '7px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '500' }}>
                                    Sign Out
                                </motion.button>
                            </div>
                        ) : (
                            <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Link href="/login" style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s' }}>Sign In</Link>
                                <motion.div whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(124,58,237,0.6)' }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <Link href="/store" style={{ padding: '9px 22px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed, #c026d3)', color: '#fff', fontSize: '0.88rem', fontWeight: '700', textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
                                        Get Started
                                    </Link>
                                </motion.div>
                            </div>
                        )}

                        {/* Hamburger */}
                        <button onClick={() => setMenuOpen(!menuOpen)} className="nav-mobile" style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.3rem', cursor: 'pointer', padding: '6px', lineHeight: 1 }}>
                            {menuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>

                {/* ── Mobile Menu ── */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            key="mobile-menu"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            style={{ background: 'rgba(8,8,16,0.96)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}
                        >
                            <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <MobileLink href="/store" onClick={() => setMenuOpen(false)}>Store</MobileLink>
                                {user && <MobileLink href="/dashboard" onClick={() => setMenuOpen(false)}>Library</MobileLink>}
                                {user
                                    ? <button onClick={handleLogout} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', padding: '10px 12px', cursor: 'pointer', borderRadius: '10px' }}>Sign Out</button>
                                    : <MobileLink href="/login" onClick={() => setMenuOpen(false)}>Sign In</MobileLink>
                                }
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            <style>{`
                @media (max-width: 768px) { .nav-desktop { display: none !important; } .nav-mobile { display: flex !important; } }
                @media (min-width: 769px) { .nav-mobile { display: none !important; } }
            `}</style>
        </>
    )
}

function NavLink({ href, children }) {
    const [hovered, setHovered] = useState(false)
    return (
        <Link href={href} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            style={{ padding: '7px 14px', borderRadius: '8px', color: hovered ? '#fff' : 'rgba(255,255,255,0.55)', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none', background: hovered ? 'rgba(255,255,255,0.07)' : 'transparent', transition: 'all 0.2s ease' }}>
            {children}
        </Link>
    )
}

function MobileLink({ href, children, onClick }) {
    return (
        <Link href={href} onClick={onClick}
            style={{ padding: '10px 12px', borderRadius: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', fontWeight: '500', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>
            {children}
        </Link>
    )
}
