import Link from 'next/link'

const TESTIMONIALS = [
    {
        name: 'Priya Sharma',
        role: 'Language Enthusiast',
        avatar: 'P',
        text: 'Linguastar completely changed how I learn Spanish. The reading experience is seamless and the content is world-class.',
        rating: 5,
        color: '#7c3aed',
    },
    {
        name: 'Arjun Mehta',
        role: 'MBA Student',
        avatar: 'A',
        text: "Best investment for learning Japanese. The secure reader works perfectly and I love how clean the platform feels.",
        rating: 5,
        color: '#ec4899',
    },
    {
        name: 'Kavya Reddy',
        role: 'Software Engineer',
        avatar: 'K',
        text: 'I have tried many platforms but Linguastar is in another league. Premium books, beautiful UI, and instant access.',
        rating: 5,
        color: '#3b82f6',
    },
]

const FEATURES = [
    {
        icon: '🔐',
        title: 'Secure Access',
        desc: 'Time-bound access with signed URLs ensures your content is always protected.',
        color: 'rgba(124,58,237,0.15)',
        border: 'rgba(124,58,237,0.3)',
    },
    {
        icon: '📖',
        title: 'Immersive Reader',
        desc: 'Watermarked PDF reader built for focus. No distractions, just learning.',
        color: 'rgba(236,72,153,0.12)',
        border: 'rgba(236,72,153,0.25)',
    },
    {
        icon: '⚡',
        title: 'Instant Access',
        desc: 'Pay once, access immediately. No waiting, no hassle — pure learning.',
        color: 'rgba(59,130,246,0.12)',
        border: 'rgba(59,130,246,0.25)',
    },
    {
        icon: '🌍',
        title: 'Any Language',
        desc: 'From Spanish to Japanese — curated books for every language learner.',
        color: 'rgba(34,197,94,0.12)',
        border: 'rgba(34,197,94,0.25)',
    },
]

function StarRating({ count = 5 }) {
    return (
        <div style={{ display: 'flex', gap: '2px' }}>
            {Array.from({ length: count }).map((_, i) => (
                <span key={i} style={{ color: '#fbbf24', fontSize: '14px' }}>★</span>
            ))}
        </div>
    )
}

export default function Home() {
    return (
        <div style={{ overflowX: 'hidden' }}>

            {/* ===================== HERO ===================== */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                paddingTop: '70px',
                overflow: 'hidden',
            }}>
                {/* Background Orbs */}
                <div className="orb orb-purple" style={{ width: '600px', height: '600px', top: '-200px', left: '-200px', opacity: 0.4 }} />
                <div className="orb orb-pink" style={{ width: '400px', height: '400px', bottom: '-100px', right: '-100px', opacity: 0.3 }} />
                <div className="orb orb-blue" style={{ width: '300px', height: '300px', top: '30%', right: '10%', opacity: 0.2 }} />

                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>

                    {/* Badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', marginBottom: '32px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa', display: 'inline-block', boxShadow: '0 0 8px #7c3aed' }} />
                        <span style={{ fontSize: '0.8rem', color: '#a78bfa', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Premium Language Learning
                        </span>
                    </div>

                    {/* Heading */}
                    <h1 style={{
                        fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                        fontWeight: '900',
                        lineHeight: '1.1',
                        letterSpacing: '-0.03em',
                        marginBottom: '24px',
                        color: 'var(--text-primary)',
                    }}>
                        Learn Any Language{' '}
                        <span className="gradient-text">Faster</span>{' '}
                        Than Ever
                    </h1>

                    <p style={{
                        fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                        color: 'var(--text-secondary)',
                        maxWidth: '600px',
                        margin: '0 auto 48px',
                        lineHeight: '1.7',
                    }}>
                        Curated premium eBooks for language learners worldwide. Secure access, beautiful reader, and instant delivery.
                    </p>

                    {/* CTA Buttons */}
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' }}>
                        <Link href="/store" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1rem' }}>
                            Browse Books →
                        </Link>
                        <Link href="/login" className="btn-secondary" style={{ padding: '16px 36px', fontSize: '1rem' }}>
                            Sign In Free
                        </Link>
                    </div>

                    {/* Social Proof */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {['A', 'B', 'C', 'D'].map((letter, i) => (
                                <div key={letter} style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${['#7c3aed','#ec4899','#3b82f6','#10b981'][i]}, ${['#a855f7','#f472b6','#60a5fa','#34d399'][i]})`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    color: 'white',
                                    border: '2px solid var(--bg-primary)',
                                    marginLeft: i > 0 ? '-10px' : '0',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                }}>
                                    {letter}
                                </div>
                            ))}
                        </div>
                        <div>
                            <StarRating />
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>500+ happy learners</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== FEATURES ===================== */}
            <section style={{ padding: '120px 24px', position: 'relative' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                    {/* Section Header */}
                    <div style={{ textAlign: 'center', marginBottom: '72px' }}>
                        <div className="badge badge-purple" style={{ marginBottom: '16px' }}>
                            ✦ Why Linguastar
                        </div>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '16px' }}>
                            Built for serious learners
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', fontSize: '1.05rem' }}>
                            Every feature designed to maximize your language learning journey.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                        {FEATURES.map((feat) => (
                            <div
                                key={feat.title}
                                className="glass glass-hover"
                                style={{ padding: '32px', background: feat.color, borderColor: feat.border }}
                            >
                                <div style={{
                                    width: '52px',
                                    height: '52px',
                                    borderRadius: '14px',
                                    background: feat.color,
                                    border: `1px solid ${feat.border}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px',
                                    marginBottom: '20px',
                                }}>
                                    {feat.icon}
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px' }}>{feat.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===================== TESTIMONIALS ===================== */}
            <section style={{ padding: '100px 24px', position: 'relative', background: 'rgba(124,58,237,0.03)' }}>
                <div className="orb orb-purple" style={{ width: '400px', height: '400px', top: '-100px', right: '0', opacity: 0.2 }} />

                <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <div className="badge badge-purple" style={{ marginBottom: '16px' }}>✦ Testimonials</div>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '800', letterSpacing: '-0.02em' }}>
                            Loved by learners
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        {TESTIMONIALS.map((t) => (
                            <div key={t.name} className="glass glass-hover" style={{ padding: '32px' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <StarRating />
                                </div>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '24px' }}>
                                    &ldquo;{t.text}&rdquo;
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '42px',
                                        height: '42px',
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${t.color}, ${t.color}99)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '15px',
                                        fontWeight: '700',
                                        color: 'white',
                                        flexShrink: 0,
                                    }}>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{t.name}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===================== CTA ===================== */}
            <section style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{
                        padding: '64px 48px',
                        borderRadius: '28px',
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.08))',
                        border: '1px solid rgba(124,58,237,0.25)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div className="orb orb-purple" style={{ width: '300px', height: '300px', top: '-150px', left: '50%', transform: 'translateX(-50%)', opacity: 0.3 }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✨</div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '16px' }}>
                                Start your journey today
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 36px', lineHeight: '1.7' }}>
                                Join thousands of learners mastering new languages with Linguastar&apos;s premium book collection.
                            </p>
                            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link href="/store" className="btn-primary" style={{ padding: '16px 36px' }}>
                                    Explore Store →
                                </Link>
                                <Link href="/login" className="btn-secondary" style={{ padding: '16px 36px' }}>
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== FOOTER ===================== */}
            <footer style={{
                borderTop: '1px solid var(--border)',
                padding: '48px 24px',
                background: 'rgba(0,0,0,0.2)',
            }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✦</div>
                        <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>Linguastar</span>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <Link href="/store" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s ease' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                            Store
                        </Link>
                        <Link href="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s ease' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                            Login
                        </Link>
                        <Link href="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s ease' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                            Dashboard
                        </Link>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        © 2025 Linguastar. All rights reserved.
                    </p>
                </div>
            </footer>

        </div>
    )
}