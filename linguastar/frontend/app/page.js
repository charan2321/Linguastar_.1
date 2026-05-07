'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

/* ─────────────── DATA ─────────────── */
const FEATURES = [
    { icon: '🔐', title: 'Secure Access', desc: 'Time-bound signed URLs protect every PDF. No sharing, no piracy.', accent: '#7c3aed' },
    { icon: '📖', title: 'Immersive Reader', desc: 'Distraction-free PDF reader with personalized watermarks.', accent: '#c026d3' },
    { icon: '⚡', title: 'Instant Delivery', desc: 'Pay once, read immediately. Zero wait time.', accent: '#2563eb' },
    { icon: '🌍', title: 'Every Language', desc: 'Spanish, Japanese, French and more — curated for all levels.', accent: '#059669' },
]

const TESTIMONIALS = [
    { name: 'Priya Sharma', role: 'Language Enthusiast', avatar: 'P', accent: '#7c3aed', text: 'The most elegant reading experience I have ever used. Linguastar completely changed how I study Spanish.' },
    { name: 'Arjun Mehta', role: 'MBA Student', accent: '#c026d3', avatar: 'A', text: 'Clean, fast, and beautifully designed. The secure reader is a game-changer for serious learners.' },
    { name: 'Kavya Reddy', role: 'Software Engineer', accent: '#2563eb', avatar: 'K', text: 'Tried many platforms — Linguastar is in another league. Premium books, premium experience.' },
]

const STATS = [
    { value: '500+', label: 'Learners' },
    { value: '50+', label: 'Books' },
    { value: '10+', label: 'Languages' },
    { value: '4.9★', label: 'Rating' },
]

/* ─────────────── ANIMATION VARIANTS ─────────────── */
const fadeUp = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

/* ─────────────── COMPONENTS ─────────────── */
function SectionBadge({ children }) {
    return (
        <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 14px', borderRadius: '999px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', marginBottom: '18px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa', display: 'inline-block', boxShadow: '0 0 8px #7c3aed', flexShrink: 0 }} />
            <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{children}</span>
        </motion.div>
    )
}

/* ─────────────── MAIN PAGE ─────────────── */
export default function Home() {
    const heroRef = useRef(null)
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

    return (
        <div style={{ overflowX: 'hidden' }}>

            {/* ═══════════════════ HERO ═══════════════════ */}
            <section ref={heroRef} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingTop: '68px', overflow: 'hidden' }}>

                {/* Background */}
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%)' }} />
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
                <motion.div style={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)', top: '-250px', left: '-150px', filter: 'blur(60px)', y: heroY, opacity: heroOpacity }} />
                <motion.div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,38,211,0.12) 0%, transparent 70%)', bottom: '-100px', right: '-100px', filter: 'blur(60px)', y: heroY }} />

                <motion.div
                    style={{ maxWidth: '860px', margin: '0 auto', padding: '80px 24px', textAlign: 'center', position: 'relative', zIndex: 1, y: heroY, opacity: heroOpacity }}
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', marginBottom: '36px', backdropFilter: 'blur(8px)' }}
                    >
                        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa', display: 'inline-block', boxShadow: '0 0 10px #7c3aed' }} />
                        <span style={{ fontSize: '0.78rem', color: '#a78bfa', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Premium Language Books</span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        style={{ fontSize: 'clamp(3rem, 8vw, 5.8rem)', fontWeight: '900', lineHeight: '1.08', letterSpacing: '-0.04em', marginBottom: '28px', color: '#fff' }}
                    >
                        Learn Any Language{' '}
                        <span style={{ background: 'linear-gradient(135deg, #a78bfa, #c026d3, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Faster
                        </span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)', color: 'rgba(255,255,255,0.5)', maxWidth: '580px', margin: '0 auto 52px', lineHeight: '1.75' }}
                    >
                        Curated premium eBooks for language learners worldwide. Secure access, immersive reader, and instant delivery.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '80px' }}
                    >
                        <motion.div whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(124,58,237,0.6)' }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <Link href="/store" style={{ padding: '16px 38px', borderRadius: '14px', background: 'linear-gradient(135deg, #7c3aed, #c026d3)', color: '#fff', fontWeight: '700', fontSize: '1rem', textDecoration: 'none', display: 'inline-block', boxShadow: '0 8px 32px rgba(124,58,237,0.4)', letterSpacing: '-0.01em' }}>
                                Browse Books →
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <Link href="/login" style={{ padding: '16px 38px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)', fontWeight: '600', fontSize: '1rem', textDecoration: 'none', display: 'inline-block', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', letterSpacing: '-0.01em' }}>
                                Sign In Free
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Social proof */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}
                    >
                        <div style={{ display: 'flex' }}>
                            {['A', 'B', 'C', 'D'].map((l, i) => (
                                <div key={l} style={{ width: '34px', height: '34px', borderRadius: '50%', background: ['linear-gradient(135deg,#7c3aed,#a855f7)', 'linear-gradient(135deg,#c026d3,#e879f9)', 'linear-gradient(135deg,#2563eb,#60a5fa)', 'linear-gradient(135deg,#059669,#34d399)'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#fff', border: '2px solid rgba(8,8,16,0.9)', marginLeft: i > 0 ? '-10px' : '0' }}>
                                    {l}
                                </div>
                            ))}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ color: '#fbbf24', fontSize: '13px', letterSpacing: '0.05em' }}>★★★★★</div>
                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>Trusted by 500+ learners</div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══════════════════ STATS ═══════════════════ */}
            <motion.section
                initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={stagger}
                style={{ padding: '0 24px', position: 'relative', zIndex: 1 }}
            >
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {STATS.map(({ value, label }) => (
                            <div key={label} style={{ padding: '36px 20px', textAlign: 'center', background: 'rgba(8,8,16,0.8)', backdropFilter: 'blur(12px)' }}>
                                <div style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: '900', letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #fff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{value}</div>
                                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', marginTop: '4px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* ═══════════════════ FEATURES ═══════════════════ */}
            <motion.section
                initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={stagger}
                style={{ padding: '140px 24px 100px', position: 'relative' }}
            >
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '72px' }}>
                        <SectionBadge>Why Linguastar</SectionBadge>
                        <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '14px', color: '#fff' }}>
                            Built for serious learners
                        </motion.h2>
                        <motion.p variants={fadeUp} style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '480px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.7' }}>
                            Every feature designed to maximize your language learning journey.
                        </motion.p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                        {FEATURES.map((f) => (
                            <motion.div
                                key={f.title}
                                variants={fadeUp}
                                whileHover={{ y: -6, boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${f.accent}40` }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                style={{ padding: '32px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', cursor: 'default' }}
                            >
                                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `${f.accent}18`, border: `1px solid ${f.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '20px' }}>{f.icon}</div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>{f.title}</h3>
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', lineHeight: '1.65' }}>{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
            <motion.section
                initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={stagger}
                style={{ padding: '100px 24px', background: 'rgba(124,58,237,0.03)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', position: 'relative', overflow: 'hidden' }}
            >
                <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', top: '-150px', right: '-100px', filter: 'blur(60px)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <SectionBadge>Testimonials</SectionBadge>
                        <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '800', letterSpacing: '-0.03em', color: '#fff' }}>
                            Loved by learners
                        </motion.h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                        {TESTIMONIALS.map((t) => (
                            <motion.div
                                key={t.name}
                                variants={fadeUp}
                                whileHover={{ y: -4 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                style={{ padding: '32px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}
                            >
                                <div style={{ color: '#fbbf24', fontSize: '14px', marginBottom: '20px', letterSpacing: '2px' }}>★★★★★</div>
                                <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: '1.75', fontSize: '0.92rem', marginBottom: '28px' }}>&ldquo;{t.text}&rdquo;</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg, ${t.accent}, ${t.accent}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '700', color: '#fff', flexShrink: 0 }}>{t.avatar}</div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.88rem', color: '#fff' }}>{t.name}</div>
                                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', marginTop: '2px' }}>{t.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* ═══════════════════ CTA ═══════════════════ */}
            <motion.section
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
                style={{ padding: '140px 24px' }}
            >
                <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
                    <motion.div
                        variants={fadeUp}
                        style={{ padding: '64px 48px', borderRadius: '28px', background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(192,38,211,0.08))', border: '1px solid rgba(124,58,237,0.2)', position: 'relative', overflow: 'hidden' }}
                    >
                        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} style={{ fontSize: '3.5rem', marginBottom: '24px' }}>✨</motion.div>
                            <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '800', letterSpacing: '-0.03em', color: '#fff', marginBottom: '16px' }}>
                                Start your journey today
                            </motion.h2>
                            <motion.p variants={fadeUp} style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '420px', margin: '0 auto 40px', lineHeight: '1.7', fontSize: '1rem' }}>
                                Join thousands of learners mastering new languages with Linguastar&apos;s premium book collection.
                            </motion.p>
                            <motion.div variants={fadeUp} style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <motion.div whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(124,58,237,0.6)' }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <Link href="/store" style={{ padding: '15px 36px', borderRadius: '14px', background: 'linear-gradient(135deg, #7c3aed, #c026d3)', color: '#fff', fontWeight: '700', fontSize: '0.98rem', textDecoration: 'none', display: 'inline-block', boxShadow: '0 8px 32px rgba(124,58,237,0.4)' }}>
                                        Explore Store →
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <Link href="/login" style={{ padding: '15px 36px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', fontWeight: '600', fontSize: '0.98rem', textDecoration: 'none', display: 'inline-block', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        Sign In
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* ═══════════════════ FOOTER ═══════════════════ */}
            <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '48px 24px', background: 'rgba(0,0,0,0.25)' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #7c3aed, #c026d3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>✦</div>
                        <span style={{ fontWeight: '800', fontSize: '1rem', color: '#fff', letterSpacing: '-0.02em' }}>Linguastar</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[{ label: 'Store', href: '/store' }, { label: 'Login', href: '/login' }, { label: 'Dashboard', href: '/dashboard' }].map(({ label, href }) => (
                            <Link key={label} href={href} style={{ padding: '7px 14px', borderRadius: '8px', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s, background 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'transparent' }}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.78rem' }}>© 2025 Linguastar. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}