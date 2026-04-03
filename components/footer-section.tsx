'use client';
import React, { ComponentProps, JSX, ReactNode, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// ── Icons (inline SVGs — no external dep needed) ───────────────
const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 11h1m4 0h1M9 15h1m4 0h1"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="#0a0a0a"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const ArrowUpRight = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
  </svg>
);

// ── Token system ───────────────────────────────────────────────
const C = {
  bg:          '#080808',
  surface:     '#0f0f0f',
  gold:        '#C9A84C',
  goldDim:     'rgba(201,168,76,0.12)',
  goldBorder:  'rgba(201,168,76,0.25)',
  white:       '#F4F1EB',
  mid:         'rgba(244,241,235,0.38)',
  dim:         'rgba(244,241,235,0.18)',
  border:      'rgba(244,241,235,0.07)',
  borderMid:   'rgba(244,241,235,0.12)',
};
const serif = "'Cormorant Garamond','Playfair Display',Georgia,serif";
const sans  = "'Helvetica Neue',Arial,sans-serif";

// ── Data ───────────────────────────────────────────────────────
const sections = [
  {
    label: 'Estates',
    links: ['Luxury Villas','Penthouses','Private Islands','New Developments'],
  },
  {
    label: 'Company',
    links: ['About LUXE','Our Agents','Press & Media','Careers'],
  },
  {
    label: 'Support',
    links: ['Contact Us','Concierge Services','Privacy Policy','Terms of Service'],
  },
];

const socials = [
  { label: 'Instagram', Icon: InstagramIcon, href: '#' },
  { label: 'LinkedIn',  Icon: LinkedinIcon,  href: '#' },
  { label: 'YouTube',   Icon: YoutubeIcon,   href: '#' },
  { label: 'Facebook',  Icon: FacebookIcon,  href: '#' },
];

// ── Hover link ─────────────────────────────────────────────────
function FooterLink({ children }: { children: string }) {
  const [hov, setHov] = useState(false);
  return (
    <li>
      <a
        href="#"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: sans, fontSize: 12, letterSpacing: '0.04em',
          color: hov ? C.white : C.mid,
          textDecoration: 'none',
          transition: 'color 0.25s ease',
        }}
      >
        <motion.span
          animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -4 }}
          transition={{ duration: 0.2 }}
          style={{ color: C.gold }}
        >
          <ArrowUpRight />
        </motion.span>
        {children}
      </a>
    </li>
  );
}

// ── Social icon button ─────────────────────────────────────────
function SocialBtn({ Icon, label, href }: { Icon: () => JSX.Element; label: string; href: string }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.a
      href={href}
      aria-label={label}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileTap={{ scale: 0.93 }}
      style={{
        width: 38, height: 38,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${hov ? C.goldBorder : C.border}`,
        backgroundColor: hov ? C.goldDim : 'transparent',
        color: hov ? C.gold : C.mid,
        transition: 'all 0.25s ease',
        cursor: 'pointer',
        textDecoration: 'none',
      }}
    >
      <Icon />
    </motion.a>
  );
}

// ── AnimatedContainer ──────────────────────────────────────────
type AnimProps = { delay?: number; className?: string; children: ReactNode; style?: React.CSSProperties };
function A({ delay = 0, children, style }: AnimProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div style={style}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ── Main footer ────────────────────────────────────────────────
export function Footersection() {
  return (
    <footer style={{
      height:'100%',
      position: 'relative',
      width: '100%',
      backgroundColor: C.bg,
      overflow: 'hidden',
      fontFamily: sans,
    }}>

      {/* ── Cinematic top divider ── */}
      <div style={{ position: 'relative', height: 1, overflow: 'hidden' }}>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute', inset: 0, transformOrigin: 'left',
            background: `linear-gradient(90deg, transparent 0%, ${C.gold} 40%, ${C.gold} 60%, transparent 100%)`,
          }}
        />
      </div>

      {/* ── Ambient radial glow ── */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 900, height: 500, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at top, rgba(201,168,76,0.06) 0%, transparent 65%)',
      }} />

      {/* ── Diagonal grain texture ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.018,
        backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
        backgroundSize: '4px 4px',
      }} />

      {/* ── Large ghost wordmark ── */}
      <div style={{
        position: 'absolute', bottom: 40, right: -20, pointerEvents: 'none',
        fontFamily: serif, fontSize: 'clamp(100px, 14vw, 200px)',
        fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1,
        color: 'rgba(201,168,76,0.04)', userSelect: 'none',
        whiteSpace: 'nowrap',
      }}>
        LUXE
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 40px 0' }}>

        {/* Top row: logo block + columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: 80,
          paddingBottom: 72,
          borderBottom: `1px solid ${C.border}`,
        }}>

          {/* ── Brand column ── */}
          <A delay={0}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              {/* Logo */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${C.gold}, #8a6320)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: C.bg, flexShrink: 0,
                  }}>
                    <BuildingIcon />
                  </div>
                  <span style={{
                    fontFamily: serif, fontSize: 26, fontWeight: 700,
                    letterSpacing: '0.12em', color: C.white,
                  }}>
                    LUXE<span style={{ color: C.gold }}>.</span>
                  </span>
                </div>

                {/* Tagline */}
                <p style={{
                  fontFamily: serif, fontSize: 18, fontStyle: 'italic',
                  fontWeight: 300, lineHeight: 1.55, color: C.mid,
                  maxWidth: 280, margin: '0 0 32px',
                  letterSpacing: '0.01em',
                }}>
                  Curating the world's most extraordinary properties for the most discerning clientele.
                </p>

                {/* Status pill */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '6px 14px',
                  border: `1px solid ${C.goldBorder}`,
                  backgroundColor: C.goldDim,
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    backgroundColor: C.gold,
                    boxShadow: `0 0 6px ${C.gold}`,
                  }} />
                  <span style={{
                    fontFamily: sans, fontSize: 9, letterSpacing: '0.22em',
                    textTransform: 'uppercase', color: C.gold, fontWeight: 700,
                  }}>
                    Accepting new clients
                  </span>
                </div>
              </div>

              {/* Social icons */}
              <div style={{ display: 'flex', gap: 8, marginTop: 40 }}>
                {socials.map(s => <SocialBtn key={s.label} {...s} />)}
              </div>
            </div>
          </A>

          {/* ── Link columns ── */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32,
          }}>
            {sections.map((sec, i) => (
              <A key={sec.label} delay={0.1 + i * 0.08}>
                <div>
                  <p style={{
                    fontFamily: sans, fontSize: 9, letterSpacing: '0.26em',
                    textTransform: 'uppercase', color: C.gold,
                    fontWeight: 700, margin: '0 0 22px',
                  }}>
                    {sec.label}
                  </p>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 13 }}>
                    {sec.links.map(l => <FooterLink key={l}>{l}</FooterLink>)}
                  </ul>
                </div>
              </A>
            ))}
          </div>
        </div>

        {/* ── Contact strip ── */}
        <A delay={0.4}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 20,
            padding: '36px 0',
            borderBottom: `1px solid ${C.border}`,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{
                fontFamily: sans, fontSize: 9, letterSpacing: '0.22em',
                textTransform: 'uppercase', color: C.dim, fontWeight: 600,
              }}>
                Reach us
              </span>
              <a href="mailto:inquiries@luxe.com" style={{
                fontFamily: serif, fontSize: 20, fontStyle: 'italic',
                color: C.white, textDecoration: 'none', letterSpacing: '0.01em',
              }}>
                inquiries@luxe.com
              </a>
            </div>

            {/* Vertical divider */}
            <div style={{ width: 1, height: 40, backgroundColor: C.border, flexShrink: 0 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{
                fontFamily: sans, fontSize: 9, letterSpacing: '0.22em',
                textTransform: 'uppercase', color: C.dim, fontWeight: 600,
              }}>
                Call us
              </span>
              <a href="tel:+919876543210" style={{
                fontFamily: serif, fontSize: 20, fontStyle: 'italic',
                color: C.white, textDecoration: 'none',
              }}>
                +91 98765 43210
              </a>
            </div>

            {/* Vertical divider */}
            <div style={{ width: 1, height: 40, backgroundColor: C.border, flexShrink: 0 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{
                fontFamily: sans, fontSize: 9, letterSpacing: '0.22em',
                textTransform: 'uppercase', color: C.dim, fontWeight: 600,
              }}>
                Offices
              </span>
              <span style={{
                fontFamily: serif, fontSize: 20, fontStyle: 'italic',
                color: C.white,
              }}>
                Mumbai · Dubai · New York
              </span>
            </div>

            {/* CTA button */}
            <motion.a
              href="#contact"
              whileHover={{ backgroundColor: C.gold, color: C.bg, borderColor: C.gold }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 28px',
                border: `1px solid ${C.goldBorder}`,
                backgroundColor: 'transparent',
                color: C.gold,
                fontFamily: sans, fontSize: 10,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                fontWeight: 700, textDecoration: 'none',
                transition: 'all 0.3s ease', cursor: 'pointer',
              }}
            >
              Book a Consultation
            </motion.a>
          </div>
        </A>

        {/* ── Bottom bar ── */}
        <A delay={0.5}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12,
            padding: '24px 0 28px',
          }}>
            <p style={{
              fontFamily: sans, fontSize: 10, letterSpacing: '0.12em',
              color: C.dim, margin: 0,
            }}>
              © {new Date().getFullYear()} LUXE Estates. All rights reserved.
            </p>

            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: C.gold }} />
              <p style={{
                fontFamily: sans, fontSize: 10, letterSpacing: '0.12em',
                color: C.dim, margin: 0,
              }}>
                Designed with excellence · Mumbai, India
              </p>
            </div>
          </div>
        </A>
      </div>
    </footer>
  );
}

export default Footersection;