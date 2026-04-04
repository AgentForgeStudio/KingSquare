'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Home, MessageCircle, Newspaper, Info, PhoneCall } from 'lucide-react';
import { useCallStore } from '@/store/callStore';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Tokens ────────────────────────────────────────────────────────
const GOLD   = '#C9A84C';
const GOLD_B = 'rgba(201,168,76,0.35)';
const EASE   = [0.22, 1, 0.36, 1] as const;
const serif  = "'Cormorant Garamond','Playfair Display',Georgia,serif";
const sans   = "'Helvetica Neue',Arial,sans-serif";

const navLinks = [
  { href: '/',           label: 'Home',       icon: Home },
  { href: '/properties', label: 'Properties', icon: Building2 },
  { href: '/about',      label: 'About',      icon: Info },
  { href: '/blog',       label: 'Blog',       icon: Newspaper },
  { href: '/contact',    label: 'Contact',    icon: MessageCircle },
] as const;

// ── Hide on scroll-down, show on scroll-up ────────────────────────
function useScrollVisibility() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  useEffect(() => {
    const fn = () => {
      const y = window.scrollY;
      if (y < 80) { setVisible(true); lastY.current = y; return; }
      setVisible(y < lastY.current);
      lastY.current = y;
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return visible;
}

// ── Desktop NavLink ───────────────────────────────────────────────
function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        textDecoration: 'none',
        fontFamily: sans,
        fontSize: 15,
        fontWeight: active ? 500 : 400,
        color: active ? GOLD : hov ? '#fff' : 'rgba(255,255,255,0.85)',
        letterSpacing: '0.02em',
        padding: '6px 0',
        transition: 'color 0.25s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
      {/* underline reveal */}
      <motion.span
        animate={{ scaleX: active || hov ? 1 : 0, opacity: active || hov ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 1,
          background: active ? GOLD : 'rgba(255,255,255,0.45)',
          transformOrigin: 'center', display: 'block',
        }}
      />
    </Link>
  );
}

// ── Animated Hamburger ────────────────────────────────────────────
function Hamburger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      style={{
        width: 44, height: 44, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.06)',
        border: `1px solid ${open ? GOLD_B : 'rgba(255,255,255,0.15)'}`,
        cursor: 'pointer', padding: 0, flexShrink: 0,
        transition: 'border-color 0.3s',
        backdropFilter: 'blur(8px)',
      }}
    >
      <motion.span
        animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.38, ease: EASE }}
        style={{ display: 'block', width: 20, height: 1.5,
          background: open ? GOLD : '#fff', marginBottom: 5, transformOrigin: 'center' }}
      />
      <motion.span
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2 }}
        style={{ display: 'block', width: 14, height: 1.5, background: '#fff', marginBottom: 5 }}
      />
      <motion.span
        animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.38, ease: EASE }}
        style={{ display: 'block', width: 20, height: 1.5,
          background: open ? GOLD : '#fff', transformOrigin: 'center' }}
      />
    </button>
  );
}

// ── Mobile Drawer ─────────────────────────────────────────────────
function MobileMenu({ open, pathname, onClose, onCall }: {
  open: boolean; pathname: string; onClose: () => void; onCall: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(8px)', zIndex: 88 }}
          />
          <motion.div
            key="panel"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.48, ease: EASE }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 'min(300px, 82vw)',
              background: '#060606',
              borderLeft: `1px solid ${GOLD_B}`,
              zIndex: 89, display: 'flex', flexDirection: 'column',
              padding: '88px 36px 48px', overflow: 'hidden',
            }}
          >
            {/* Ambient glow */}
            <div style={{
              position: 'absolute', top: -80, right: -80, width: 260, height: 260,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(201,168,76,0.09) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            {/* Ghost letter */}
            <div style={{
              position: 'absolute', bottom: -24, left: -12,
              fontFamily: serif, fontSize: 200, fontWeight: 300,
              color: 'rgba(201,168,76,0.04)', lineHeight: 1,
              userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.05em',
            }}>K</div>

            <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {navLinks.map(({ href, label }, i) => {
                const active = pathname === href;
                return (
                  <motion.div key={href}
                    initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 28 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: EASE }}
                  >
                    <Link href={href} onClick={onClose} style={{
                      display: 'flex', alignItems: 'baseline', gap: 14,
                      padding: '18px 0', textDecoration: 'none', position: 'relative',
                    }}>
                      {active && (
                        <span style={{
                          position: 'absolute', left: -18, top: '50%', transform: 'translateY(-50%)',
                          width: 4, height: 4, borderRadius: '50%',
                          background: GOLD, boxShadow: `0 0 8px ${GOLD}`,
                        }} />
                      )}
                      <span style={{
                        fontFamily: serif, fontSize: 30, fontWeight: 300, fontStyle: 'italic',
                        color: active ? GOLD : 'rgba(244,241,235,0.65)', transition: 'color 0.2s',
                      }}>{label}</span>
                      <span style={{
                        fontFamily: sans, fontSize: 9, letterSpacing: '0.22em',
                        textTransform: 'uppercase', color: 'rgba(244,241,235,0.22)',
                      }}>0{i + 1}</span>
                    </Link>
                    <div style={{ height: 1, background: 'rgba(244,241,235,0.05)' }} />
                  </motion.div>
                );
              })}
            </nav>

            <motion.button
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ delay: 0.45, duration: 0.4, ease: EASE }}
              onClick={() => { onClose(); onCall(); }}
              whileHover={{ background: GOLD, color: '#060606', borderColor: GOLD }}
              whileTap={{ scale: 0.97 }}
              style={{
                marginTop: 36, width: '100%', padding: '14px 0',
                border: `1px solid ${GOLD_B}`, background: 'transparent', color: GOLD,
                fontFamily: sans, fontSize: 10, letterSpacing: '0.22em',
                textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all 0.3s',
              }}
            >
              <PhoneCall size={12} />
              Talk to Agent
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────
export function Navbar() {
  const pathname        = usePathname();
  const openCallOptions = useCallStore((s) => s.openCallOptions);
  const [menuOpen, setMenuOpen] = useState(false);
  const visible = useScrollVisibility();

  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

        /* CTA button */
        .ks-cta {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 11px 22px;
          border: 1px solid ${GOLD_B};
          background: rgba(201,168,76,0.08);
          color: ${GOLD};
          font-family: ${sans};
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          transition: background 0.3s, color 0.3s, border-color 0.3s;
          flex-shrink: 0;
        }
        .ks-cta:hover {
          background: ${GOLD};
          color: #060606;
          border-color: ${GOLD};
        }
        /* PhoneCall icon pulse */
        .ks-cta svg {
          animation: phonePulse 2.4s ease-in-out infinite;
        }
        @keyframes phonePulse {
          0%, 100% { opacity: 1; transform: rotate(0deg); }
          20%       { transform: rotate(-12deg); }
          40%       { transform: rotate(10deg); }
          60%       { opacity: 0.7; transform: rotate(0deg); }
        }

        @media (min-width: 1024px) { .ks-burger { display: none !important; } }
        @media (max-width: 1023px) { .ks-desktop { display: none !important; } }
        @media (max-width: 640px)  { .ks-cta-mobile { font-size: 11px !important; padding: 10px 16px !important; } }
      `}</style>

      <motion.header
        animate={{ y: visible ? 0 : -110, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 90,
          /* Gradient fade from dark at top → fully transparent below
             so the navbar text is always readable without a harsh box */
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)',
          padding: '0 clamp(20px, 4vw, 60px)',
          height: 76,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        {/* ── Logo ── */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <img
            src="./rm.png"
            alt="Logo"
            style={{
              height: 48,           /* ← bigger */
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.6))',  /* keeps it visible on any bg */
            }}
          />
        </Link>

        {/* ── Desktop links (centred) ── */}
        <div
          className="ks-desktop"
          style={{
            display: 'flex', alignItems: 'center',
            gap: 'clamp(20px, 3vw, 44px)',
            flex: 1, justifyContent: 'center',
          }}
        >
          {navLinks.map(({ href, label }) => (
            <NavLink key={href} href={href} label={label} active={pathname === href} />
          ))}
        </div>

        {/* ── Talk to Agent CTA (desktop) ── */}
        <button className="ks-cta ks-desktop   " onClick={openCallOptions}>
          <PhoneCall size={14} />
         <span className='font-bold '> Talk to Agent</span>
        </button>

        {/* ── Talk to Agent (mobile — compact) + hamburger ── */}
        <div className="ks-burger" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="ks-cta font-bold ks-cta-mobile " onClick={openCallOptions}>
            <PhoneCall size={13} />
            Talk to Agent
          </button>
          <Hamburger open={menuOpen} onClick={() => setMenuOpen(o => !o)} />
        </div>
      </motion.header>

      <MobileMenu
        open={menuOpen}
        pathname={pathname}
        onClose={() => setMenuOpen(false)}
        onCall={openCallOptions}
      />
    </>
  );
}

export default Navbar;