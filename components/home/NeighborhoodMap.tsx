'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// ── tokens (light / white background) ─────────────────────────
const gold        = '#B8952A';
const goldDim     = 'rgba(184,149,42,0.12)';
const goldBorder  = 'rgba(184,149,42,0.35)';
const ink         = '#0F0F0F';
const inkMid      = 'rgba(15,15,15,0.55)';
const inkLight    = 'rgba(15,15,15,0.32)';
const cardSurface = '#F7F4EE';
const borderLine  = 'rgba(15,15,15,0.10)';
const displayFont = "'Cormorant Garamond','Playfair Display',Georgia,serif";
const sansFont    = "'Helvetica Neue',Arial,sans-serif";

const neighborhoods = [
  { name: 'Beverly Hills',  city: 'Los Angeles', count: 124,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=900&auto=format&fit=crop' },
  { name: 'Bel Air',        city: 'Los Angeles', count: 87,
    image: 'https://images.unsplash.com/photo-1613490908681-3e4b7b2fb0eb?q=80&w=900&auto=format&fit=crop' },
  { name: 'Hollywood Hills',city: 'Los Angeles', count: 63,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=900&auto=format&fit=crop' },
  { name: 'Downtown',       city: 'Dubai',       count: 156,
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=900&auto=format&fit=crop' },
  { name: 'Upper East Side',city: 'New York',    count: 92,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=900&auto=format&fit=crop' },
  { name: 'Palm Jumeirah',  city: 'Dubai',       count: 78,
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=900&auto=format&fit=crop' },
];

const MapPinIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

// Letter-by-letter animated heading
function AnimatedHeading({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref  = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <span ref={ref} style={{ display: 'inline-block' }}>
      {text.split(' ').map((word, wi) => (
        <span key={wi} style={{ display: 'inline-block', marginRight: '0.22em' }}>
          {word.split('').map((ch, ci) => (
            <motion.span
              key={ci}
              style={{ display: 'inline-block' }}
              initial={{ opacity: 0, y: 22, rotateX: 40 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.5, delay: delay + wi * 0.06 + ci * 0.022, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}

// Individual card
function NeighborhoodCard({ area, index }: { area: typeof neighborhoods[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: 'relative', height: 340, overflow: 'hidden', cursor: 'pointer',
        border: `1px solid ${hovered ? goldBorder : borderLine}`,
        backgroundColor: cardSurface,
        transition: 'border-color 0.45s ease',
      }}
    >
      {/* Photo */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${area.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}
        animate={{ scale: hovered ? 1.08 : 1, opacity: hovered ? 0.82 : 0.65 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Gradient — light theme: white fade at bottom */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(247,244,238,0.97) 0%, rgba(247,244,238,0.55) 38%, transparent 100%)',
      }} />

      {/* Gold tint on hover */}
      <motion.div
        style={{ position: 'absolute', inset: 0 }}
        animate={{ backgroundColor: hovered ? goldDim : 'rgba(184,149,42,0)' }}
        transition={{ duration: 0.45 }}
      />

      {/* Index badge */}
      <motion.div
        style={{
          position: 'absolute', top: 18, right: 18,
          fontFamily: sansFont, fontSize: 10, letterSpacing: '0.18em',
          color: gold, fontWeight: 600,
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {String(index + 1).padStart(2, '0')}
      </motion.div>

      {/* Content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 26px 28px' }}>
        {/* City */}
        <motion.div
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            color: gold, fontSize: 9, letterSpacing: '0.22em',
            textTransform: 'uppercase', fontFamily: sansFont,
            fontWeight: 700, marginBottom: 8,
          }}
          animate={{ y: hovered ? 0 : 4, opacity: hovered ? 1 : 0.75 }}
          transition={{ duration: 0.35 }}
        >
          <MapPinIcon />
          {area.city}
        </motion.div>

        {/* Name */}
        <h3 style={{
          margin: '0 0 10px', fontFamily: displayFont,
          fontSize: 26, fontWeight: 400, letterSpacing: '-0.01em',
          lineHeight: 1.1, color: ink,
        }}>
          {area.name}
        </h3>

        {/* Reveal on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 7 }}
          transition={{ duration: 0.3, delay: hovered ? 0.05 : 0 }}
        >
          <div style={{ width: 24, height: 1, backgroundColor: gold, marginBottom: 8 }} />
          <p style={{
            margin: 0, fontFamily: sansFont, fontSize: 10,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: inkMid, fontWeight: 500,
          }}>
            {area.count} exclusive properties
          </p>
        </motion.div>
      </div>

      {/* Bottom gold bar */}
      <motion.div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 2, backgroundColor: gold, transformOrigin: 'left',
        }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}

// ── Main export ─────────────────────────────────────────────────
export function NeighborhoodMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '120px 0 140px',
        backgroundColor: '#FFFFFF',
        borderTop: `1px solid ${borderLine}`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Subtle warm glow */}
      <div style={{
        position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 400, pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(184,149,42,0.05) 0%, transparent 70%)',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 72 }}>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6 }}
            style={{ width: 36, height: 1, backgroundColor: gold, transformOrigin: 'left', marginBottom: 18 }}
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.1 }}
            style={{
              fontFamily: sansFont, fontSize: 9, letterSpacing: '0.28em',
              textTransform: 'uppercase', color: gold, margin: '0 0 20px', fontWeight: 700,
            }}
          >
            Prime Locations
          </motion.p>

          <h2 style={{
            fontFamily: displayFont,
            fontSize: 'clamp(42px,6vw,74px)',
            fontWeight: 300, letterSpacing: '-0.025em', lineHeight: 1.05,
            color: ink, margin: '0 0 26px',
          }}>
            <AnimatedHeading text="Explore" delay={0.15} />
            {' '}
            <span style={{ fontStyle: 'italic', color: gold }}>
              <AnimatedHeading text="Neighborhoods" delay={0.28} />
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.52 }}
            style={{
              fontFamily: sansFont, fontSize: 14, lineHeight: 1.75,
              color: inkMid, maxWidth: 420, margin: 0, fontWeight: 300,
            }}
          >
            Discover luxury living in the world's most coveted addresses — curated for the discerning few.
          </motion.p>
        </div>

        {/* ── Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: 20,
        }}>
          {neighborhoods.map((area, i) => (
            <NeighborhoodCard key={area.name} area={area} index={i} />
          ))}
        </div>

        {/* ── Footer rule ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          style={{
            marginTop: 64, height: 1,
            background: `linear-gradient(90deg, ${gold}, transparent)`,
            transformOrigin: 'left',
          }}
        />
      </div>
    </section>
  );
}

export default NeighborhoodMap;