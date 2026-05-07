'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'

export default function Store() {
    const [books, setBooks] = useState([])
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [buying, setBuying] = useState(null)
    const [search, setSearch] = useState('')

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

    // ========================================= BUY BOOK
    const handleBuy = async (book) => {
        try {
            if (!user) {
                window.location.href = '/login'
                return
            }
            setBuying(book.id)

            const res = await fetch('/api/createOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: book.price })
            })
            const order = await res.json()

            if (!order.id) {
                alert('Order creation failed')
                setBuying(null)
                return
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: 'INR',
                name: 'Linguastar',
                description: book.title,
                order_id: order.id,
                theme: { color: '#7c3aed' },
                handler: async function (response) {
                    try {
                        const saveRes = await fetch('/api/savePurchase', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                user_id: user.id,
                                book_id: book.id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        })
                        const saveData = await saveRes.json()
                        if (!saveRes.ok) {
                            alert(saveData.error || 'Payment verification failed')
                            return
                        }
                        window.location.href = '/dashboard'
                    } catch (err) {
                        console.error(err)
                        alert('Payment save failed')
                    }
                },
                modal: { ondismiss: () => setBuying(null) }
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
            rzp.on('payment.failed', () => setBuying(null))

        } catch (err) {
            console.error(err)
            alert('Something went wrong')
            setBuying(null)
        }
    }

    const filtered = books.filter(b => b.title?.toLowerCase().includes(search.toLowerCase()))

    // ========================================= SKELETON
    if (loading) {
        return (
            <div style={{ padding: '120px 24px', maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ height: '40px', width: '220px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', marginBottom: '48px' }} className="shimmer" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="glass shimmer" style={{ height: '280px', borderRadius: '20px' }} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', paddingTop: '90px' }}>

            {/* ===== HEADER ===== */}
            <div style={{
                padding: '60px 24px 40px',
                position: 'relative',
                overflow: 'hidden',
                borderBottom: '1px solid var(--border)',
                background: 'linear-gradient(180deg, rgba(124,58,237,0.07) 0%, transparent 100%)',
            }}>
                <div className="orb orb-purple" style={{ width: '400px', height: '400px', top: '-200px', right: '0', opacity: 0.2 }} />
                <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div className="badge badge-purple" style={{ marginBottom: '16px' }}>📚 Book Store</div>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: '800',
                        letterSpacing: '-0.02em',
                        marginBottom: '12px',
                    }}>
                        Premium Language Books
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '480px' }}>
                        Hand-picked books to accelerate your language learning journey.
                    </p>

                    {/* Search */}
                    <div style={{ marginTop: '32px', maxWidth: '400px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '16px' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search books..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="input-dark"
                            style={{ paddingLeft: '44px' }}
                        />
                    </div>
                </div>
            </div>

            {/* ===== BOOKS GRID ===== */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>

                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
                        <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>No books found</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Try a different search term or check back soon.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {filtered.map((book, idx) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                onBuy={handleBuy}
                                isBuying={buying === book.id}
                                delay={idx * 80}
                            />
                        ))}
                    </div>
                )}

                {/* Guest CTA */}
                {!user && (
                    <div style={{
                        marginTop: '64px',
                        padding: '40px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(168,85,247,0.05))',
                        border: '1px solid rgba(124,58,237,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '20px',
                    }}>
                        <div>
                            <h3 style={{ fontWeight: '700', marginBottom: '6px' }}>Ready to start learning?</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to purchase books and track your progress.</p>
                        </div>
                        <Link href="/login" className="btn-primary">
                            Sign In Free →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

function BookCard({ book, onBuy, isBuying, delay }) {
    const COLORS = [
        { from: '#7c3aed', to: '#a855f7' },
        { from: '#ec4899', to: '#f472b6' },
        { from: '#3b82f6', to: '#60a5fa' },
        { from: '#10b981', to: '#34d399' },
        { from: '#f59e0b', to: '#fbbf24' },
    ]
    const color = COLORS[book.title?.length % COLORS.length] || COLORS[0]

    return (
        <div
            className="glass glass-hover"
            style={{
                borderRadius: '20px',
                overflow: 'hidden',
                animation: `fadeInUp 0.5s ease ${delay}ms both`,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Cover */}
            <div style={{
                height: '160px',
                background: `linear-gradient(135deg, ${color.from}22, ${color.to}44)`,
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    fontSize: '3.5rem',
                    filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.3))',
                }}>📗</div>
                {/* Shine effect */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(135deg, ${color.from}15, transparent 60%)`,
                }} />
            </div>

            {/* Content */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{
                        fontSize: '1.05rem',
                        fontWeight: '700',
                        marginBottom: '8px',
                        lineHeight: '1.4',
                        color: 'var(--text-primary)',
                    }}>
                        {book.title}
                    </h2>
                    {book.description && (
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.5',
                            marginBottom: '12px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}>
                            {book.description}
                        </p>
                    )}
                </div>

                <div style={{ marginTop: '16px' }}>
                    {/* Price Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: '800',
                            background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            ₹{book.price}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                            <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>Available</span>
                        </div>
                    </div>

                    {/* Buy Button */}
                    <button
                        onClick={() => onBuy(book)}
                        disabled={isBuying}
                        style={{
                            width: '100%',
                            padding: '13px',
                            borderRadius: '12px',
                            border: 'none',
                            background: isBuying ? 'rgba(124,58,237,0.3)' : `linear-gradient(135deg, ${color.from}, ${color.to})`,
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: isBuying ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease',
                            boxShadow: isBuying ? 'none' : `0 4px 20px ${color.from}44`,
                        }}
                        onMouseEnter={e => { if (!isBuying) e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                        {isBuying ? (
                            <>
                                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                                Processing...
                            </>
                        ) : (
                            '⚡ Buy Now'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}