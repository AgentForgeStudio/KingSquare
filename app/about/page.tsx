'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Award, Users, Home, TrendingUp, Quote } from 'lucide-react';

// ─── Easing ────────────────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Variants ──────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};
const fadeLeft = {
  hidden: { opacity: 0, x: -28 },
  visible: (delay = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};
const lineGrow = {
  hidden: { scaleX: 0 },
  visible: (delay = 0) => ({
    scaleX: 1,
    transition: { duration: 0.75, delay, ease: EASE },
  }),
};
const fadeRight = {
  hidden: { opacity: 0, x: 28 },
  visible: (delay = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

// ─── Data ──────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '10K+', label: 'Deals Closed',       icon: Home },
  { value: '98%',  label: 'Client Satisfaction', icon: Award },
  { value: '500+', label: 'Expert Executives',   icon: Users },
  { value: '15+',  label: 'Years of Excellence', icon: TrendingUp },
];

const VALUES = [
  {
    number: '01',
    title: 'Integrity First',
    description: 'Every recommendation we make is guided by what is truly best for our clients — not what earns us the highest commission. Transparent. Honest. Always.',
  },
  {
    number: '02',
    title: 'Relentless Research',
    description: 'We study every micro-market, every price movement, every neighbourhood shift. When you work with kingsquare, you have the most informed team in the room.',
  },
  {
    number: '03',
    title: 'White-Glove Service',
    description: 'From first consultation to key handover, every touchpoint is crafted to feel effortless. We handle the complexity so you can enjoy the journey.',
  },
  {
    number: '04',
    title: 'Long-Term Partnership',
    description: "Our relationship doesn't end at the closing table. We become your lifelong real estate partner — through resales, renovations, and the next chapter.",
  },
];

const TEAM = [
  {
    name: 'Vinayak Waghle',
    role: 'CEO',
    specialty: 'Luxury Residential',
    deals: 1200,
    image: '/vinayak.jpeg',
  },
  {
    name: 'Rohan',
    role: 'Co-founder',
    specialty: 'Commercial Real Estate',
    deals: 640,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  },
  {
    name: 'Priya Nair',
    role: 'Head of Sales',
    specialty: 'Investment Properties',
    deals: 890,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  },
  {
    name: 'Kavya Shah',
    role: 'Senior Executive',
    specialty: 'New Developments',
    deals: 510,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  },
];

const MILESTONES = [
  { year: '2009', title: 'Founded', description: 'kingsquare was born in Naigaon with a vision to redefine luxury real estate through trust and precision.' },
  { year: '2013', title: 'First 1000 Deals', description: 'Reached our first thousand closed transactions, establishing ourselves as Naigaon\'s go-to luxury agency.' },
  { year: '2017', title: 'National Expansion', description: 'Extended operations to Delhi, Bangalore, and Hyderabad with a network of 200+ vetted executives.' },
  { year: '2020', title: 'KingSquare AI Launch', description: 'Launched India\'s first AI-powered property concierge, transforming how clients discover their dream homes.' },
  { year: '2024', title: '10,000 Families Housed', description: 'Celebrated our ten-thousandth successful transaction — a milestone built on relationships, not transactions.' },
];

const TESTIMONIALS = [
  {
    quote: "kingsquare didn't just find us a home. They found us the neighbourhood we didn't know we needed. The attention to detail was unlike anything we've experienced.",
    name: 'Riya & Aditya Kapoor',
    location: 'Naigaon East, Naigaon',
    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=200&q=80',
  },
  {
    quote: "As an investor, I needed a team that understood both the emotional and financial dimensions of real estate. kingsquare delivered on every front.",
    name: 'Suresh Malhotra',
    location: 'Commercial Investor, Delhi',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
  },
  {
    quote: "I've worked with agencies in Virar, Virar, and Singapore. The level of service kingsquare provides is genuinely world-class.",
    name: 'Natasha Iyer',
    location: 'Juchandra, Naigaon',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
  },
];

// ─── Section label component ───────────────────────────────────────────────────
function SectionLabel({ children, delay = 0 }: { children: string; delay?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
      <motion.span
        custom={delay} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeLeft}
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#b8b5ae', fontWeight: 600 }}
      >
        {children}
      </motion.span>
      <motion.div
        custom={delay + 0.1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={lineGrow}
        style={{ height: 1, width: 48, backgroundColor: '#c8a96e', transformOrigin: 'left' }}
      />
    </div>
  );
}

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const [hov, setHov] = useState(false);
  const Icon = stat.icon;
  return (
    <motion.div
      custom={index * 0.12} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: '36px 28px',
        border: `1px solid ${hov ? 'rgba(200,169,110,0.35)' : 'rgba(10,10,10,0.09)'}`,
        transition: 'border-color 0.3s',
        position: 'relative' as const, overflow: 'hidden',
      }}
    >
      {/* Hover fill */}
      <motion.div
        animate={{ scaleY: hov ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(200,169,110,0.05)', transformOrigin: 'bottom', pointerEvents: 'none' }}
      />

      {/* Ghost number */}
      <span style={{ position: 'absolute', top: 8, right: 12, fontFamily: "'Playfair Display', Georgia, serif", fontSize: 64, fontWeight: 900, color: 'rgba(10,10,10,0.04)', lineHeight: 1, userSelect: 'none', transition: 'color 0.3s' }}>
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Icon box */}
      <div style={{ position: 'relative', width: 44, height: 44, border: `1px solid ${hov ? 'rgba(200,169,110,0.4)' : 'rgba(10,10,10,0.10)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, transition: 'border-color 0.3s', overflow: 'hidden' }}>
        <motion.div animate={{ scaleY: hov ? 1 : 0 }} transition={{ duration: 0.3, ease: EASE }} style={{ position: 'absolute', inset: 0, backgroundColor: '#c8a96e', transformOrigin: 'bottom' }} />
        <Icon size={18} style={{ position: 'relative', zIndex: 1, color: hov ? '#fafaf8' : '#888880', transition: 'color 0.3s' }} />
      </div>

      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 700, color: '#0a0a0a', lineHeight: 1, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
        {stat.value}
      </p>
      <div style={{ height: 1, width: 28, backgroundColor: '#c8a96e', margin: '12px 0' }} />
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#888880', margin: 0, fontWeight: 600 }}>
        {stat.label}
      </p>
    </motion.div>
  );
}

// ─── Team card ─────────────────────────────────────────────────────────────────
function TeamCard({ member, index }: { member: typeof TEAM[0]; index: number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      custom={index * 0.1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4', marginBottom: 16 }}>
        <motion.div
          animate={{ scale: hov ? 1.06 : 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Image src={member.image} alt={member.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
        </motion.div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%)' }} />

        {/* Deals badge */}
        <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: '#fafaf8', lineHeight: 1 }}>
            {member.deals}+
          </span>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.6)', margin: '2px 0 0', fontWeight: 600 }}>
            deals
          </p>
        </div>

        {/* Hover CTA */}
        <AnimatePresence>
          {hov && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: EASE }}
              style={{ position: 'absolute', top: 14, right: 14 }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', backgroundColor: '#fafaf8', color: '#0a0a0a', fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' as const, fontWeight: 600 }}>
                View <ArrowRight size={10} />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Accent line */}
      <div style={{ height: 1, backgroundColor: 'rgba(10,10,10,0.1)', marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
        <motion.div
          animate={{ scaleX: hov ? 1 : 0.2 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ position: 'absolute', inset: 0, backgroundColor: '#c8a96e', transformOrigin: 'left' }}
        />
      </div>

      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: hov ? '#c8a96e' : '#0a0a0a', transition: 'color 0.3s', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
        {member.name}
      </h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#888880', margin: '0 0 4px', fontWeight: 600 }}>
        {member.role}
      </p>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#b8b5ae', margin: 0, fontWeight: 300 }}>
        {member.specialty}
      </p>
    </motion.div>
  );
}

// ─── Milestone row ─────────────────────────────────────────────────────────────
function MilestoneRow({ milestone, index }: { milestone: typeof MILESTONES[0]; index: number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      custom={index * 0.1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid', gridTemplateColumns: '80px 1px 1fr',
        gap: '0 32px', alignItems: 'start',
        padding: '28px 0',
        borderBottom: '1px solid rgba(10,10,10,0.07)',
      }}
    >
      {/* Year */}
      <div>
        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: hov ? '#c8a96e' : '#0a0a0a', transition: 'color 0.3s', margin: 0, lineHeight: 1 }}>
          {milestone.year}
        </p>
      </div>

      {/* Vertical line + dot */}
      <div style={{ position: 'relative', alignSelf: 'stretch', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 1, flex: 1, backgroundColor: 'rgba(10,10,10,0.1)' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: hov ? '#c8a96e' : 'rgba(10,10,10,0.2)', transition: 'background-color 0.3s', margin: '8px 0', flexShrink: 0 }} />
        <div style={{ width: 1, flex: 1, backgroundColor: 'rgba(10,10,10,0.1)' }} />
      </div>

      {/* Content */}
      <div style={{ paddingTop: 2 }}>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: '#0a0a0a', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
          {milestone.title}
        </h3>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#888880', lineHeight: 1.75, fontWeight: 300, margin: 0 }}>
          {milestone.description}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Testimonial card ──────────────────────────────────────────────────────────
function TestimonialCard({ t, index }: { t: typeof TESTIMONIALS[0]; index: number }) {
  return (
    <motion.div
      custom={index * 0.12} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
      style={{ padding: '32px', border: '1px solid rgba(10,10,10,0.09)', position: 'relative' as const }}
    >
      {/* Quote mark */}
      <div style={{ position: 'absolute', top: 20, right: 24 }}>
        <Quote size={28} style={{ color: 'rgba(200,169,110,0.25)' }} />
      </div>

      {/* Accent line */}
      <div style={{ height: 1, width: 32, backgroundColor: '#c8a96e', marginBottom: 24 }} />

      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontStyle: 'italic', color: '#0a0a0a', lineHeight: 1.7, margin: '0 0 24px', fontWeight: 400 }}>
        "{t.quote}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, overflow: 'hidden', flexShrink: 0 }}>
          <Image src={t.image} alt={t.name} width={40} height={40} className="object-cover w-full h-full" />
        </div>
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: '#0a0a0a', margin: '0 0 2px' }}>
            {t.name}
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#b8b5ae', margin: 0, letterSpacing: '0.06em' }}>
            {t.location}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const heroRef    = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroImgY  = useTransform(heroScroll, [0, 1], [0, 120]);
  const heroWmY   = useTransform(heroScroll, [0, 1], [0, 60]);

  const { scrollYProgress: manifestoScroll } = useScroll({ target: manifestoRef, offset: ['start end', 'end start'] });
  const manifestoY = useTransform(manifestoScroll, [0, 1], [40, -40]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fafaf8; }
        a { text-decoration: none; color: inherit; }
        img { display: block; }
      `}</style>

      <main style={{ backgroundColor: '#fafaf8', minHeight: '100vh', overflowX: 'hidden' }}>

        {/* ──────────────────────────────────────────────────────────────────────
            HERO
        ────────────────────────────────────────────────────────────────────── */}
        <header ref={heroRef} style={{ position: 'relative', height: '100vh', minHeight: 600, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>

          {/* Parallax image */}
          <motion.div style={{ y: heroImgY, position: 'absolute', inset: '-10% 0', zIndex: 0 }}>
            <Image
              src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=85"
              alt="FIND Real Estate"
              fill className="object-cover"
              sizes="100vw" priority
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.45) 60%, rgba(10,10,10,0.2) 100%)' }} />
          </motion.div>

          {/* Parallax watermark */}
          <motion.div style={{ y: heroWmY, position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '5vw', pointerEvents: 'none', zIndex: 1 }}>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(80px, 16vw, 220px)', fontWeight: 900, color: 'rgba(255,255,255,0.04)', lineHeight: 1, userSelect: 'none', letterSpacing: '-0.03em' }}>
              KINGSQUARE
            </span>
          </motion.div>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '0 clamp(24px, 5vw, 80px)', width: '100%' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <motion.span
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}
              >
                Our Story
              </motion.span>
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
                style={{ height: 1, width: 48, backgroundColor: '#c8a96e', transformOrigin: 'left' }}
              />
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.35, ease: EASE }}
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(44px, 7.5vw, 100px)', fontWeight: 900, color: '#fafaf8', lineHeight: 0.93, letterSpacing: '-0.025em', margin: '0 0 24px' }}
            >
              We Don't
              <br />
              <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>
                Just Sell
              </em>
              <br />
              Homes.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(14px, 1.4vw, 17px)', fontWeight: 300, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: 460, margin: '0 0 44px' }}
            >
              We guide families, investors, and visionaries toward places that transform how they live. Founded in 2009, kingsquare has become India's most trusted name in luxury real estate.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
              style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
            >
              <Link href="/properties" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 28px',
                backgroundColor: '#fafaf8', color: '#0a0a0a',
                fontFamily: "'DM Sans', sans-serif", fontSize: 10,
                letterSpacing: '0.18em', textTransform: 'uppercase' as const, fontWeight: 600,
              }}>
                View Properties <ArrowRight size={13} />
              </Link>
              <Link href="#team" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 28px',
                border: '1px solid rgba(255,255,255,0.25)',
                backgroundColor: 'rgba(0,0,0,0)', color: 'rgba(255,255,255,0.8)',
                fontFamily: "'DM Sans', sans-serif", fontSize: 10,
                letterSpacing: '0.18em', textTransform: 'uppercase' as const, fontWeight: 600,
              }}>
                Meet the Team
              </Link>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 2 }}
          >
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Scroll</p>
            <motion.div
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.3)', transformOrigin: 'top' }}
            />
          </motion.div>
        </header>

        {/* ──────────────────────────────────────────────────────────────────────
            MANIFESTO
        ────────────────────────────────────────────────────────────────────── */}
        <section ref={manifestoRef} style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(80px, 12vw, 160px) clamp(24px, 5vw, 80px)', backgroundColor: '#fafaf8' }}>

          {/* Parallax watermark */}
          <motion.div style={{ y: manifestoY, position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(80px, 18vw, 260px)', fontWeight: 900, color: 'rgba(10,10,10,0.03)', whiteSpace: 'nowrap', userSelect: 'none', lineHeight: 1 }}>
              Mission
            </span>
          </motion.div>

          <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: 'clamp(48px, 8vw, 120px)', alignItems: 'center' }}>

              {/* Left */}
              <div>
                <SectionLabel delay={0}>Why kingsquare</SectionLabel>
                <motion.h2
                  custom={0.15} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 700, color: '#0a0a0a', lineHeight: 1.05, letterSpacing: '-0.02em' }}
                >
                  Your life's changing.
                  <br />
                  <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#b8b5ae' }}>Don't just find a place —</em>
                  <br />
                  find what's next.
                </motion.h2>

                <motion.div
                  custom={0.28} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={lineGrow}
                  style={{ height: 1, width: 48, backgroundColor: '#c8a96e', margin: '28px 0', transformOrigin: 'left' }}
                />

                <motion.p
                  custom={0.35} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 300, color: '#888880', lineHeight: 1.85 }}
                >
                  We help you move forward with clarity, confidence, and the right executive by your side. Whether you're buying your first home, scaling an investment portfolio, or simply seeking a change — kingsquare is built for this moment.
                </motion.p>
              </div>

              {/* Right — image with overlap */}
              <motion.div
                custom={0.2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeRight}
                style={{ position: 'relative' }}
              >
                <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
                  <Image
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=85"
                    alt="kingsquare Real Estate Office"
                    fill className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {/* Floating stat card */}
                <motion.div
                  initial={{ opacity: 0, x: 20, y: 20 }} whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                  style={{ position: 'absolute', bottom: -24, left: -24, padding: '20px 24px', backgroundColor: '#0a0a0a', minWidth: 180 }}
                >
                  <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 700, color: '#c8a96e', lineHeight: 1, margin: '0 0 4px' }}>
                    15+
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.4)', margin: 0, fontWeight: 600 }}>
                    Years of Excellence
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────────────
            STATS
        ────────────────────────────────────────────────────────────────────── */}
        <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)', backgroundColor: '#f3f1ed', borderTop: '1px solid rgba(10,10,10,0.07)', borderBottom: '1px solid rgba(10,10,10,0.07)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <SectionLabel delay={0}>By the Numbers</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 1, backgroundColor: 'rgba(10,10,10,0.08)' }}>
              {STATS.map((s, i) => (
                <div key={s.label} style={{ backgroundColor: '#f3f1ed' }}>
                  <StatCard stat={s} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────────────
            VALUES
        ────────────────────────────────────────────────────────────────────── */}
        <section style={{ padding: 'clamp(80px, 12vw, 140px) clamp(24px, 5vw, 80px)', backgroundColor: '#fafaf8' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: '60px 80px', alignItems: 'start' }}>

              {/* Left heading */}
              <div style={{ position: 'sticky', top: 80 }}>
                <SectionLabel delay={0}>Our Principles</SectionLabel>
                <motion.h2
                  custom={0.15} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, color: '#0a0a0a', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 24 }}
                >
                  What we
                  <br />
                  <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#b8b5ae' }}>believe in</em>
                </motion.h2>
                <motion.p
                  custom={0.28} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: '#888880', lineHeight: 1.8 }}
                >
                  Four principles guide every decision we make — from the executives we hire to the properties we recommend to the way we communicate.
                </motion.p>
              </div>

              {/* Right values list */}
              <div>
                {VALUES.map((v, i) => (
                  <motion.div
                    key={v.number}
                    custom={i * 0.12} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp}
                    style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: '0 20px', paddingBottom: 40, marginBottom: 40, borderBottom: i < VALUES.length - 1 ? '1px solid rgba(10,10,10,0.07)' : 'none' }}
                  >
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 13, fontWeight: 700, color: '#c8a96e', paddingTop: 4 }}>
                      {v.number}
                    </span>
                    <div>
                      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: '#0a0a0a', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
                        {v.title}
                      </h3>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: '#888880', lineHeight: 1.8, margin: 0 }}>
                        {v.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────────────
            TEAM
        ────────────────────────────────────────────────────────────────────── */}
        <section id="team" style={{ padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)', backgroundColor: '#f3f1ed', borderTop: '1px solid rgba(10,10,10,0.07)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 56 }}>
              <div>
                <SectionLabel delay={0}>The People</SectionLabel>
                <motion.h2
                  custom={0.15} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, color: '#0a0a0a', lineHeight: 1.05, letterSpacing: '-0.02em' }}
                >
                  Meet the
                  <br />
                  <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#b8b5ae' }}>Experts</em>
                </motion.h2>
              </div>
              <motion.div
                custom={0.2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              >
                <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, fontWeight: 600, color: '#0a0a0a' }}>
                  Work With Us
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, border: '1px solid #0a0a0a' }}>
                    <ArrowRight size={13} />
                  </span>
                </Link>
              </motion.div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: '48px 24px' }}>
              {TEAM.map((m, i) => <TeamCard key={m.name} member={m} index={i} />)}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────────────
            MILESTONES
        ────────────────────────────────────────────────────────────────────── */}
        <section style={{ padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)', backgroundColor: '#0a0a0a' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '60px 100px', alignItems: 'start' }}>

            {/* Left */}
            <div style={{ position: 'sticky', top: 80 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <motion.span
                  custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeLeft}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}
                >
                  Our Journey
                </motion.span>
                <motion.div
                  custom={0.1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={lineGrow}
                  style={{ height: 1, width: 48, backgroundColor: '#c8a96e', transformOrigin: 'left' }}
                />
              </div>

              <motion.h2
                custom={0.15} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, color: '#fafaf8', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 24 }}
              >
                Fifteen years
                <br />
                <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.35)' }}>in the making</em>
              </motion.h2>
              <motion.p
                custom={0.28} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.45)', lineHeight: 1.85 }}
              >
                From a single office in Naigaon to a nationwide network — every chapter of our story has been written with integrity.
              </motion.p>

              {/* Decorative city image */}
              <motion.div
                custom={0.4} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                style={{ position: 'relative', marginTop: 40, aspectRatio: '16/9', overflow: 'hidden' }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=800&q=80"
                  alt="Naigaon Skyline"
                  fill className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.6), transparent)' }} />
                <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.5)', margin: 0, fontWeight: 600 }}>
                    Naigaon, India
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right — milestones */}
            <div>
              {MILESTONES.map((m, i) => (
                <div key={m.year} style={{ display: 'grid', gridTemplateColumns: '80px 1px 1fr', gap: '0 28px', alignItems: 'start', padding: '24px 0', borderBottom: i < MILESTONES.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <motion.p
                    custom={i * 0.1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-20px' }} variants={fadeUp}
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: '#c8a96e', lineHeight: 1, margin: 0 }}
                  >
                    {m.year}
                  </motion.p>
                  <div style={{ alignSelf: 'stretch', width: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />
                  <motion.div
                    custom={i * 0.1 + 0.05} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-20px' }} variants={fadeUp}
                  >
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: '#fafaf8', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
                      {m.title}
                    </h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, margin: 0 }}>
                      {m.description}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────────────
            TESTIMONIALS
        ────────────────────────────────────────────────────────────────────── */}
        <section style={{ padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)', backgroundColor: '#fafaf8' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 56 }}>
              <div>
                <SectionLabel delay={0}>Client Stories</SectionLabel>
                <motion.h2
                  custom={0.15} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, color: '#0a0a0a', lineHeight: 1.05, letterSpacing: '-0.02em' }}
                >
                  Don't take
                  <br />
                  <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#b8b5ae' }}>our word for it</em>
                </motion.h2>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 1, backgroundColor: 'rgba(10,10,10,0.08)' }}>
              {TESTIMONIALS.map((t, i) => (
                <div key={t.name} style={{ backgroundColor: '#fafaf8' }}>
                  <TestimonialCard t={t} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────────────
            CTA STRIP
        ────────────────────────────────────────────────────────────────────── */}
        <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)', backgroundColor: '#0a0a0a' }}>
          {/* Background image */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
            <Image src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=70" alt="" fill className="object-cover" sizes="100vw" />
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0a0a0a 40%, rgba(10,10,10,0.6) 100%)' }} />

          <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '48px 80px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <motion.span custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeLeft}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
                  Begin Your Journey
                </motion.span>
                <motion.div custom={0.1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={lineGrow}
                  style={{ height: 1, width: 40, backgroundColor: '#c8a96e', transformOrigin: 'left' }} />
              </div>
              <motion.h2 custom={0.18} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, color: '#fafaf8', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                Ready to find
                <br />
                <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>what's next?</em>
              </motion.h2>
            </div>

            <motion.div custom={0.3} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link href="/properties" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 24px', backgroundColor: '#fafaf8', color: '#0a0a0a',
                fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                letterSpacing: '0.16em', textTransform: 'uppercase' as const, fontWeight: 600,
              }}>
                Browse Properties <ArrowRight size={14} />
              </Link>
              <Link href="/contact" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 24px',
                border: '1px solid rgba(255,255,255,0.15)',
                backgroundColor: 'rgba(0,0,0,0)', color: 'rgba(255,255,255,0.6)',
                fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                letterSpacing: '0.16em', textTransform: 'uppercase' as const, fontWeight: 600,
              }}>
                Talk to an Executive <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </section>

      </main>
    </>
  );
}
