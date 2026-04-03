'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── tokens ─────────────────────────────────────────────────────
const gold        = '#B8952A';
const goldDim     = 'rgba(184,149,42,0.10)';
const goldBorder  = 'rgba(184,149,42,0.35)';
const ink         = '#0F0F0F';
const inkMid      = 'rgba(15,15,15,0.50)';
const displayFont = "'Cormorant Garamond','Playfair Display',Georgia,serif";
const sansFont    = "'Helvetica Neue',Arial,sans-serif";

const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07
      A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67
      A2 2 0 0 1 3.6 2.37h3a2 2 0 0 1 2 1.72
      c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91
      a16 16 0 0 0 6.18 6.18l.95-.95a2 2 0 0 1 2.11-.45
      c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

interface PhoneValueOfferProps {
  onDismiss?: () => void;
}

export function PhoneValueOffer({ onDismiss }: PhoneValueOfferProps) {
  const [hovered, setHovered]   = useState(false);
  const [visible, setVisible]   = useState(true);

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss?.(), 380);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, height: 0, paddingTop: 0, paddingBottom: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative',
            backgroundColor: '#FFFFFF',
            borderBottom: `1px solid ${goldBorder}`,
            overflow: 'hidden',
          }}
        >
          {/* Warm gold tint — left & right wings */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `linear-gradient(90deg, ${goldDim} 0%, transparent 28%, transparent 72%, ${goldDim} 100%)`,
          }} />

          {/* Animated gold sweep line at bottom */}
          <motion.div
            style={{
              position: 'absolute', bottom: 0, left: 0, height: 1,
              background: `linear-gradient(90deg, transparent, ${gold}, transparent)`,
            }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.1, delay: 0.35, ease: 'easeOut' }}
          />

          <div style={{
            maxWidth: 1280, margin: '0 auto',
            padding: '14px 32px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 16,
            flexWrap: 'wrap',
          }}>

            {/* Left: rule + copy */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {/* Vertical gold rule */}
              <div style={{ width: 1, height: 34, backgroundColor: gold, flexShrink: 0 }} />

              <div>
                <p style={{
                  fontFamily: sansFont, fontSize: 9, letterSpacing: '0.24em',
                  textTransform: 'uppercase', color: gold,
                  margin: '0 0 3px', fontWeight: 700,
                }}>
                  Exclusive Offer
                </p>
                <p style={{
                  fontFamily: displayFont, fontSize: 18,
                  color: ink, margin: 0, fontWeight: 400,
                  letterSpacing: '0.01em', fontStyle: 'italic',
                }}>
                  Get a complimentary property valuation — speak with our agents
                </p>
              </div>
            </div>

            {/* Right: CTA + dismiss */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <motion.a
                href="tel:+919876543210"
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '9px 22px',
                  border: `1px solid ${gold}`,
                  backgroundColor: hovered ? gold : 'transparent',
                  color: hovered ? '#FFFFFF' : gold,
                  fontFamily: sansFont, fontSize: 10,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  fontWeight: 700, textDecoration: 'none',
                  transition: 'background-color 0.25s ease, color 0.25s ease',
                  cursor: 'pointer',
                }}
                whileTap={{ scale: 0.97 }}
              >
                <PhoneIcon />
                +91 98765 43210
              </motion.a>

              {onDismiss && (
                <motion.button
                  onClick={dismiss}
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  aria-label="Dismiss"
                  style={{
                    background: 'none',
                    border: `1px solid rgba(15,15,15,0.15)`,
                    color: inkMid, cursor: 'pointer',
                    width: 30, height: 30,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0,
                  }}
                >
                  <CloseIcon />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PhoneValueOffer;