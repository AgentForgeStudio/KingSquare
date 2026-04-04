'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Phone, Mail, ArrowRight, X, Sparkles } from 'lucide-react';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { useCallStore } from '@/store/callStore';

// ─── Shared constants ──────────────────────────────────────────────────────────
const GOLD = '#c8a96e';
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.85, delay: d, ease: EASE } }),
};
const lineGrow = {
  hidden: { scaleX: 0 },
  visible: (d = 0) => ({ scaleX: 1, transition: { duration: 0.7, delay: d, ease: EASE } }),
};

// ══════════════════════════════════════════════════════════════════════════════
// PhoneValueOffer — slim editorial banner, white + gold
// ══════════════════════════════════════════════════════════════════════════════
interface PhoneValueOfferProps {
  onDismiss?: () => void;
}

export function PhoneValueOffer({ onDismiss }: PhoneValueOfferProps) {
  const [hovered, setHovered] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.55, ease: EASE }}
      style={{
        position: 'relative',
        background: '#fff',
        borderBottom: '1px solid #e8e0d0',
        overflow: 'hidden',
      }}
    >
      {/* Gold top rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent 0%, ${GOLD} 30%, ${GOLD} 70%, transparent 100%)` }} />

      {/* Subtle warm background wash */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(200,169,110,0.04) 0%, rgba(200,169,110,0.08) 50%, rgba(200,169,110,0.04) 100%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', padding: '20px 0', flexWrap: 'wrap' }}>

          {/* Left: label + text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, minWidth: 0 }}>
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={12} style={{ color: GOLD }} />
              <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: GOLD, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                Exclusive Offer
              </span>
              <Sparkles size={12} style={{ color: GOLD }} />
            </div>
            <div style={{ width: '1px', height: '28px', background: '#e5e5e5', flexShrink: 0 }} />
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)', color: '#1a1a1a', fontWeight: 500, margin: 0, letterSpacing: '-0.01em' }}>
              Complimentary property valuation — speak with a senior agent today
            </p>
          </div>

          {/* Right: CTA + dismiss */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <a
              href="tel:+919876543210"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 24px',
                background: hovered ? '#0a0a0a' : GOLD,
                color: hovered ? '#fff' : '#fff',
                fontFamily: "'Inter', sans-serif",
                fontSize: '12px', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                textDecoration: 'none',
                transition: 'background 0.3s ease',
              }}
            >
              <Phone size={12} />
              +91 98765 43210
            </a>

            {onDismiss && (
              <button
                onClick={handleDismiss}
                style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid #e5e5e5', cursor: 'pointer', color: '#a3a3a3', transition: 'border-color 0.2s, color 0.2s' }}
                aria-label="Dismiss"
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0a0a0a'; (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e5e5'; (e.currentTarget as HTMLElement).style.color = '#a3a3a3'; }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gold bottom rule — thinner */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: '#e8e0d0' }} />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CTABanner — full editorial section, white background, cinematic feel
// ══════════════════════════════════════════════════════════════════════════════
interface CTABannerProps {
  openCallOptions?: () => void;
  openScheduleModal?: () => void;
}

export function CTABanner({ openCallOptions, openScheduleModal }: CTABannerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const wmY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const [callHov, setCallHov] = useState(false);
  const [mailHov, setMailHov] = useState(false);
  const storeOpenCallOptions = useCallStore((state) => state.openCallOptions);
  const storeOpenScheduleModal = useCallStore((state) => state.openScheduleModal);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600&display=swap');`}</style>

      <section
        ref={sectionRef}
        style={{ position: 'relative', background: '#fff', overflow: 'hidden', borderTop: '1px solid #e5e5e5' }}
      >
        {/* Parallax watermark */}
        <motion.div
          style={{ y: wmY, position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}
          aria-hidden
        >
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '22vw', fontWeight: 900, lineHeight: 1, color: 'rgba(0,0,0,0.028)', whiteSpace: 'nowrap', userSelect: 'none', fontStyle: 'italic' }}>
            Begin
          </span>
        </motion.div>

        {/* Gold corner ornament — top left */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '120px', height: '120px', opacity: 0.35 }} viewBox="0 0 120 120" fill="none">
          <path d="M0 0 L120 0 L0 120 Z" fill={`${GOLD}18`} />
          <path d="M0 0 L60 0 L0 60" stroke={GOLD} strokeWidth="0.5" fill="none" />
          <path d="M0 0 L30 0 L0 30" stroke={GOLD} strokeWidth="0.5" fill="none" opacity="0.5" />
        </svg>

        {/* Gold corner ornament — bottom right */}
        <svg style={{ position: 'absolute', bottom: 0, right: 0, width: '120px', height: '120px', opacity: 0.35, transform: 'rotate(180deg)' }} viewBox="0 0 120 120" fill="none">
          <path d="M0 0 L120 0 L0 120 Z" fill={`${GOLD}18`} />
          <path d="M0 0 L60 0 L0 60" stroke={GOLD} strokeWidth="0.5" fill="none" />
          <path d="M0 0 L30 0 L0 30" stroke={GOLD} strokeWidth="0.5" fill="none" opacity="0.5" />
        </svg>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '960px', margin: '0 auto', padding: '120px 48px', textAlign: 'center' }}>

          {/* Label */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '32px' }}>
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={lineGrow} custom={0}
              style={{ height: '1px', width: '48px', background: GOLD, transformOrigin: 'right' as const }}
            />
            <motion.span
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.05}
              style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: GOLD, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
            >
              Start Your Journey
            </motion.span>
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={lineGrow} custom={0.1}
              style={{ height: '1px', width: '48px', background: GOLD, transformOrigin: 'left' as const }}
            />
          </div>

          {/* Headline */}
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.15}
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', fontWeight: 700, color: '#0a0a0a', lineHeight: 0.95, letterSpacing: '-0.025em', marginBottom: '28px' }}
          >
            Find Your Dream<br />
            <em style={{ fontStyle: 'italic', color: GOLD }}>Property Today</em>
          </motion.h2>

          {/* Gold rule */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={lineGrow} custom={0.3}
            style={{ height: '1px', width: '40px', background: GOLD, transformOrigin: 'center', margin: '0 auto 28px' }}
          />

          {/* Body */}
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.35}
            style={{ fontSize: '1.05rem', color: '#737373', maxWidth: '520px', margin: '0 auto 52px', lineHeight: 1.85, fontWeight: 300, fontFamily: "'Inter', sans-serif" }}
          >
            Connect with our expert agents and discover extraordinary properties that match your lifestyle.
            Personalised service, global reach, unmatched expertise.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.45}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}
          >
            {/* Primary — solid gold */}
            <button
              onClick={() => (openCallOptions ?? storeOpenCallOptions)()}
              onMouseEnter={() => setCallHov(true)}
              onMouseLeave={() => setCallHov(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '16px 36px',
                background: callHov ? '#0a0a0a' : GOLD,
                color: '#fff',
                border: 'none', cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase' as const,
                transition: 'background 0.35s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <Phone size={14} />
              Talk to an Agent
            </button>

            {/* Secondary — outlined */}
            <button
              onClick={() => (openScheduleModal ?? storeOpenScheduleModal)()}
              onMouseEnter={() => setMailHov(true)}
              onMouseLeave={() => setMailHov(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '15px 36px',
                background: mailHov ? `${GOLD}18` : 'transparent',
                color: mailHov ? '#0a0a0a' : '#0a0a0a',
                border: `1px solid ${mailHov ? GOLD : '#d4d4d4'}`,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase' as const,
                transition: 'background 0.3s, border-color 0.3s',
              }}
            >
              <Mail size={14} />
              Schedule a Meeting
            </button>
          </motion.div>

          {/* Browse link */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.55}
            style={{ marginTop: '40px' }}
          >
            <BrowseLink />
          </motion.div>

          {/* Decorative bottom number row */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.65}
            style={{ marginTop: '72px', display: 'flex', justifyContent: 'center', gap: '0', borderTop: '1px solid #e5e5e5', paddingTop: '40px' }}
          >
            {[['2,500+', 'Properties'], ['98%', 'Satisfaction'], ['15+', 'Years'], ['500+', 'Agents']].map(([val, lbl], i, arr) => (
              <div key={lbl} style={{ flex: 1, maxWidth: '160px', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid #e5e5e5' : 'none', padding: '0 24px' }}>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '6px' }}>{val}</p>
                <p style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#a3a3a3', fontFamily: "'Inter', sans-serif" }}>{lbl}</p>
              </div>
            ))}
          </motion.div>

        </div>
      </section>
    </>
  );
}

function BrowseLink() {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href="#properties"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' as const,
        fontWeight: 600, fontFamily: "'Inter', sans-serif",
        color: hov ? GOLD : '#a3a3a3',
        textDecoration: 'none',
        transition: 'color 0.25s',
      }}
    >
      Browse Properties
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', border: `1px solid ${hov ? GOLD : '#d4d4d4'}`, transition: 'border-color 0.25s', overflow: 'hidden', position: 'relative' as const }}>
        <ArrowRight size={12} style={{ transition: 'transform 0.25s', transform: hov ? 'translateX(3px)' : 'translateX(0)' }} />
      </span>
    </Link>
  );
}
