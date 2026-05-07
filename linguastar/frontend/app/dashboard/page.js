'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'

export default function Dashboard() {
    const [books, setBooks] = useState([])
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    window.location.href = '/login'
                    return
                }
                setUser(user)

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

                if (error) { console.error(error); return }
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

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    }

    // ===== LOADING STATE =====
    if (loading) {
        return (
            <div style={{ minHeight: '100vh', paddingTop: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="spinner" style={{ margin: '0 auto 16px' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Loading your library...</p>
                </div>
            </div>
        )
    }

    const activeBooks = books.filter(b => getDaysLeft(b.expiry_date) > 0)
    const expiredBooks = books.filter(b => getDaysLeft(b.expiry_date) === 0)

    return (
        <div style={{ minHeight: '100vh', paddingTop: '90px' }}>

            {/* ===== HEADER ===== */}
            <div style={{
                padding: '48px 24px 40px',
                borderBottom: '1px solid var(--border)',
                background: 'linear-gradient(180deg, rgba(124,58,237,0.06) 0%, transparent 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div className="orb orb-purple" style={{ width: '400px', height: '400px', top: '-200px', right: '-100px', opacity: 0.2 }} />
                <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <div className="badge badge-purple" style={{ marginBottom: '16px' }}>📚 My Library</div>
                            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                                Welcome back
                                {user?.email && <span className="gradient-text"> ✦</span>}
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                {user?.email} · {books.length} book{books.length !== 1 ? 's' : ''} purchased
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <Link href="/store" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
                                Browse Store
                            </Link>
                            <button onClick={handleLogout} className="btn-ghost" style={{ fontSize: '0.875rem' }}>
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div style={{ display: 'flex', gap: '16px', marginTop: '32px', flexWrap: 'wrap' }}>
                        <StatCard icon="📖" label="Total Books" value={books.length} color="#7c3aed" />
                        <StatCard icon="✅" label="Active" value={activeBooks.length} color="#22c55e" />
                        <StatCard icon="⏰" label="Expired" value={expiredBooks.length} color="#f59e0b" />
                    </div>
                </div>
            </div>

            {/* ===== BOOKS GRID ===== */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>

                {books.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        {/* Active Books */}
                        {activeBooks.length > 0 && (
                            <div style={{ marginBottom: '48px' }}>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
                                    Active Access
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                    {activeBooks.map((item, idx) => (
                                        <DashboardCard key={item.id} item={item} getDaysLeft={getDaysLeft} idx={idx} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Expired Books */}
                        {expiredBooks.length > 0 && (
                            <div>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block', boxShadow: '0 0 8px #f59e0b' }} />
                                    Expired Access
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                    {expiredBooks.map((item, idx) => (
                                        <DashboardCard key={item.id} item={item} getDaysLeft={getDaysLeft} idx={idx} expired />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

function StatCard({ icon, label, value, color }) {
    return (
        <div style={{
            padding: '16px 24px',
            borderRadius: '14px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '140px',
        }}>
            <span style={{ fontSize: '1.4rem' }}>{icon}</span>
            <div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color, lineHeight: '1' }}>{value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
            </div>
        </div>
    )
}

function DashboardCard({ item, getDaysLeft, idx, expired }) {
    const daysLeft = getDaysLeft(item.expiry_date)
    const urgentColor = daysLeft <= 7 ? '#f59e0b' : '#22c55e'

    return (
        <div
            className="glass glass-hover"
            style={{
                borderRadius: '20px',
                overflow: 'hidden',
                animation: `fadeInUp 0.5s ease ${idx * 60}ms both`,
                opacity: expired ? 0.6 : 1,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Top accent bar */}
            <div style={{
                height: '4px',
                background: expired
                    ? 'rgba(245,158,11,0.4)'
                    : 'linear-gradient(90deg, #7c3aed, #a855f7)',
            }} />

            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Book icon + title */}
                <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', alignItems: 'flex-start' }}>
                    <div style={{
                        width: '52px',
                        height: '64px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.1))',
                        border: '1px solid rgba(124,58,237,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.6rem',
                        flexShrink: 0,
                    }}>
                        📗
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '0.95rem', fontWeight: '700', lineHeight: '1.4', marginBottom: '6px' }}>
                            {item.books?.title}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>₹{item.books?.price}</p>
                    </div>
                </div>

                {/* Expiry info */}
                <div style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: expired ? 'rgba(245,158,11,0.07)' : 'rgba(34,197,94,0.07)',
                    border: `1px solid ${expired ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)'}`,
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}>
                    <span style={{ fontSize: '1rem' }}>{expired ? '⏰' : '✅'}</span>
                    <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '600', color: expired ? '#fbbf24' : '#4ade80' }}>
                            {expired ? 'Access expired' : `${daysLeft} days remaining`}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                            Expires {new Date(item.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                    </div>
                </div>

                {/* Expiry progress bar */}
                {!expired && (
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${Math.min(100, (daysLeft / 60) * 100)}%`,
                                background: `linear-gradient(90deg, ${urgentColor}, ${urgentColor}88)`,
                                borderRadius: '999px',
                                transition: 'width 0.5s ease',
                            }} />
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div style={{ marginTop: 'auto' }}>
                    {expired ? (
                        <Link href="/store" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '12px',
                            borderRadius: '12px',
                            border: '1px solid rgba(124,58,237,0.3)',
                            color: 'var(--accent-light)',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            textDecoration: 'none',
                            background: 'rgba(124,58,237,0.07)',
                            transition: 'all 0.2s ease',
                        }}>
                            🔄 Renew Access
                        </Link>
                    ) : (
                        <Link href={`/reader/${item.books?.id}`} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '12px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            textDecoration: 'none',
                            boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
                            transition: 'all 0.2s ease',
                        }}>
                            📖 Read Now
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

function EmptyState() {
    return (
        <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            maxWidth: '480px',
            margin: '0 auto',
        }}>
            <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                margin: '0 auto 28px',
                animation: 'float 4s ease-in-out infinite',
            }}>
                📚
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px' }}>Your library is empty</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.6' }}>
                Start your language learning journey by purchasing your first premium book.
            </p>
            <Link href="/store" className="btn-primary">
                Browse the Store →
            </Link>
        </div>
    )
}