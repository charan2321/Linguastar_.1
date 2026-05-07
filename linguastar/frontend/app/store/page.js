'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'

/* ─── animation variants ─── */
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

const PALETTE = [
    { from: '#7c3aed', to: '#a855f7' },
    { from: '#c026d3', to: '#e879f9' },
    { from: '#2563eb', to: '#60a5fa' },
    { from: '#059669', to: '#34d399' },
    { from: '#d97706', to: '#fcd34d' },
]

export default function Store() {
    const [books, setBooks] = useState([])
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [buying, setBuying] = useState(null)
    const [search, setSearch] = useState('')
    const [focused, setFocused] = useState(false)

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            const { data } = await supabase.from('books').select('*')
            setBooks(data || [])
            setLoading(false)
        }
        init()
    }, [])

    /* ─────── BUY HANDLER — unchanged logic ─────── */
    const handleBuy = async (book) => {
        try {
            if (!user) { window.location.href = '/login'; return }
            setBuying(book.id)

            const res = await fetch('/api/createOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: book.price }),
            })
            const order = await res.json()
            if (!order.id) { alert('Order creation failed'); setBuying(null); return }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: 'INR',
                name: 'Linguastar',
                description: book.title,
                order_id: order.id,
                theme: { color: '#7c3aed' },
                handler: async (response) => {
                    try {
                        const saveRes = await fetch('/api/savePurchase', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                user_id: user.id,
                                book_id: book.id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        })
                        const saveData = await saveRes.json()
                        if (!saveRes.ok) { alert(saveData.error || 'Verification failed'); return }
                        window.location.href = '/dashboard'
                    } catch (err) { console.error(err); alert('Payment save failed') }
                },
                modal: { ondismiss: () => setBuying(null) },
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
            rzp.on('payment.failed', () => setBuying(null))
        } catch (err) { console.error(err); alert('Something went wrong'); setBuying(null) }
    }

    const filtered = books.filter(b => b.title?.toLowerCase().includes(search.toLowerCase()))

    /* ─────── SKELETON ─────── */
    if (loading) {
        return (
            <div style={{ minHeight: '100vh', paddingTop: '90px' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
                    <div style={{ height: '42px', width: '260px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', marginBottom: '56px', animation: 'pulse 1.6s ease-in-out infinite' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{ height: '300px', borderRadius: '22px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 0.15}s` }} />
                        ))}
                    </div>
                </div>
                <style>{`@keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }`}</style>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', paddingTop: '90px' }}>

            {/* ═══ HEADER ═══ */}
            <div style={{ padding: '56px 24px 44px', position: 'relative', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 0% 0%, rgba(124,58,237,0.1) 0%, transparent 60%)' }} />
                <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)', marginBottom: '18px' }}>
                            <span style={{ fontSize: '0.72rem', color: '#a78bfa', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase' }}>📚 Book Store</span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: '900', letterSpacing: '-0.03em', color: '#fff', marginBottom: '12px', lineHeight: '1.1' }}>
                            Premium Language Books
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.05rem', maxWidth: '480px', lineHeight: '1.6', marginBottom: '32px' }}>
                            Hand-picked books to accelerate your language learning journey.
                        </p>
                    </motion.div>

                    {/* Search */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }} style={{ maxWidth: '420px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', fontSize: '15px', pointerEvents: 'none' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search books..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            style={{
                                width: '100%', paddingLeft: '44px', paddingRight: '16px', paddingTop: '13px', paddingBottom: '13px',
                                background: 'rgba(255,255,255,0.04)', border: `1px solid ${focused ? 'rgba(124,58,237,0.6)' : 'rgba(255,255,255,0.08)'}`,
                                borderRadius: '12px', color: '#fff', fontSize: '0.92rem', outline: 'none', fontFamily: 'inherit',
                                transition: 'border-color 0.25s, box-shadow 0.25s',
                                boxShadow: focused ? '0 0 0 3px rgba(124,58,237,0.15)' : 'none',
                            }}
                        />
                    </motion.div>
                </div>
            </div>

            {/* ═══ BOOKS GRID ═══ */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '52px 24px' }}>
                <AnimatePresence mode="wait">
                    {filtered.length === 0 ? (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '80px 24px' }}>
                            <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>📭</div>
                            <h3 style={{ fontWeight: '700', fontSize: '1.2rem', color: '#fff', marginBottom: '10px' }}>No books found</h3>
                            <p style={{ color: 'rgba(255,255,255,0.35)' }}>Try a different search term or check back soon.</p>
                        </motion.div>
                    ) : (
                        <motion.div key="grid" initial="hidden" animate="show" variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                            {filtered.map((book, idx) => (
                                <BookCard key={book.id} book={book} idx={idx} onBuy={handleBuy} isBuying={buying === book.id} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Guest CTA */}
                {!user && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
                        style={{ marginTop: '64px', padding: '40px 48px', borderRadius: '22px', background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(192,38,211,0.05))', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}
                    >
                        <div>
                            <h3 style={{ fontWeight: '700', marginBottom: '6px', color: '#fff', fontSize: '1.1rem' }}>Ready to start learning?</h3>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem' }}>Sign in to purchase books and access your library.</p>
                        </div>
                        <motion.div whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(124,58,237,0.5)' }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <Link href="/login" style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed, #c026d3)', color: '#fff', fontWeight: '700', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}>
                                Sign In Free →
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

/* ─────── BOOK CARD ─────── */
function BookCard({ book, idx, onBuy, isBuying }) {
    const color = PALETTE[idx % PALETTE.length]
    const [hovered, setHovered] = useState(false)

    return (
        <motion.div
            variants={fadeUp}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            animate={hovered ? { y: -8 } : { y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            style={{ borderRadius: '22px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${hovered ? `${color.from}50` : 'rgba(255,255,255,0.07)'}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.3s, box-shadow 0.3s', boxShadow: hovered ? `0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px ${color.from}30` : '0 4px 24px rgba(0,0,0,0.2)', cursor: 'default', backdropFilter: 'blur(12px)' }}
        >
            {/* Cover */}
            <div style={{ height: '164px', background: `linear-gradient(135deg, ${color.from}20, ${color.to}35)`, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <motion.div animate={hovered ? { scale: 1.12, rotate: 5 } : { scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} style={{ fontSize: '3.8rem', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))' }}>
                    📗
                </motion.div>
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${color.from}10, transparent 60%)` }} />
                {/* Shimmer on hover */}
                <motion.div animate={hovered ? { x: '100%', opacity: [0, 0.15, 0] } : { x: '-100%', opacity: 0 }} transition={{ duration: 0.6, ease: 'easeInOut' }} style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', transform: 'skewX(-12deg)' }} />
            </div>

            {/* Content */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', lineHeight: '1.4', marginBottom: '12px' }}>{book.title}</h2>
                {book.description && (
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', lineHeight: '1.55', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {book.description}
                    </p>
                )}
                <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span style={{ fontSize: '1.55rem', fontWeight: '900', letterSpacing: '-0.03em', background: `linear-gradient(135deg, ${color.from}, ${color.to})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            ₹{book.price}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: '#4ade80', fontWeight: '600' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} />
                            Available
                        </span>
                    </div>
                    <motion.button
                        onClick={() => onBuy(book)}
                        disabled={isBuying}
                        whileHover={!isBuying ? { scale: 1.03 } : {}}
                        whileTap={!isBuying ? { scale: 0.97 } : {}}
                        transition={{ type: 'spring', stiffness: 300 }}
                        style={{
                            width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
                            background: isBuying ? 'rgba(124,58,237,0.25)' : `linear-gradient(135deg, ${color.from}, ${color.to})`,
                            color: isBuying ? 'rgba(255,255,255,0.4)' : '#fff', fontWeight: '700', fontSize: '0.9rem', cursor: isBuying ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit',
                            boxShadow: isBuying ? 'none' : `0 4px 20px ${color.from}44`,
                            transition: 'background 0.3s, box-shadow 0.3s',
                        }}
                    >
                        {isBuying ? (
                            <>
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} style={{ width: '15px', height: '15px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: 'rgba(255,255,255,0.6)' }} />
                                Processing...
                            </>
                        ) : '⚡ Buy Now'}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}