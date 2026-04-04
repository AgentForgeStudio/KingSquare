'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Calendar, Mail, ArrowRight } from 'lucide-react';
import { useCallStore } from '@/store/callStore';
import { useLeadStore } from '@/store/leadStore';
import { PhoneCaptureGate } from '../phone-capture/PhoneCaptureGate';

// ─── Easing ────────────────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Option Card ───────────────────────────────────────────────────────────────
function OptionCard({
  icon: Icon,
  number,
  title,
  description,
  cta,
  delay,
  onClick,
  accentColor = '#c8a96e',
}: {
  icon: React.ElementType;
  number: string;
  title: string;
  description: string;
  cta: string;
  delay: number;
  onClick: () => void;
  accentColor?: string;
}) {
  const [hov, setHov] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '32px 28px',
        background: 'none',
        border: `1px solid ${hov ? 'rgba(200,169,110,0.4)' : 'rgba(10,10,10,0.10)'}`,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color 0.3s',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Hover background fill */}
      <motion.div
        animate={{ scaleY: hov ? 1 : 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        style={{
          position: 'absolute', inset: 0,
          backgroundColor: 'rgba(200,169,110,0.04)',
          transformOrigin: 'bottom',
          pointerEvents: 'none',
        }}
      />

      {/* Ghost number */}
      <span style={{
        position: 'absolute', top: 12, right: 16,
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 64, fontWeight: 900, lineHeight: 1,
        color: 'rgba(10,10,10,0.04)',
        userSelect: 'none', pointerEvents: 'none',
        transition: 'color 0.3s',
      }}>
        {number}
      </span>

      {/* Icon box */}
      <div style={{
        position: 'relative',
        width: 52, height: 52,
        border: `1px solid ${hov ? 'rgba(200,169,110,0.45)' : 'rgba(10,10,10,0.10)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 28, transition: 'border-color 0.3s', overflow: 'hidden',
      }}>
        <motion.div
          animate={{ scaleY: hov ? 1 : 0 }}
          transition={{ duration: 0.32, ease: EASE }}
          style={{ position: 'absolute', inset: 0, backgroundColor: '#c8a96e', transformOrigin: 'bottom' }}
        />
        <Icon
          size={20}
          style={{
            position: 'relative', zIndex: 1,
            color: hov ? '#fafaf8' : '#888880',
            transition: 'color 0.3s',
          }}
        />
      </div>

      {/* Accent line */}
      <div style={{ height: 1, width: '100%', backgroundColor: 'rgba(10,10,10,0.07)', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
        <motion.div
          animate={{ scaleX: hov ? 1 : 0.25 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ position: 'absolute', inset: 0, backgroundColor: '#c8a96e', transformOrigin: 'left' }}
        />
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 22, fontWeight: 700,
        color: hov ? '#c8a96e' : '#0a0a0a',
        lineHeight: 1.1, letterSpacing: '-0.01em',
        margin: '0 0 10px',
        transition: 'color 0.3s',
      }}>
        {title}
      </h3>

      {/* Description */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13, fontWeight: 300, lineHeight: 1.75,
        color: '#888880', margin: '0 0 24px', flex: 1,
      }}>
        {description}
      </p>

      {/* CTA */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10, fontWeight: 600,
        letterSpacing: '0.18em', textTransform: 'uppercase' as const,
        color: hov ? '#c8a96e' : '#0a0a0a',
        transition: 'color 0.3s',
      }}>
        {cta}
        <span style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 30, height: 30,
          border: `1px solid ${hov ? 'rgba(200,169,110,0.5)' : 'rgba(10,10,10,0.15)'}`,
          transition: 'all 0.3s',
          overflow: 'hidden', position: 'relative',
        }}>
          <motion.div
            animate={{ x: hov ? 0 : -30, opacity: hov ? 1 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ position: 'absolute' }}
          >
            <ArrowRight size={12} />
          </motion.div>
          <motion.div
            animate={{ x: hov ? 30 : 0, opacity: hov ? 0 : 1 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ position: 'absolute' }}
          >
            <ArrowRight size={12} />
          </motion.div>
        </span>
      </div>
    </motion.button>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────────
export function CallOptionsModal() {
  const [showPhoneGate, setShowPhoneGate] = useState(false);

  const isModalOpen      = useCallStore((s) => s.isModalOpen);
  const closeCallOptions = useCallStore((s) => s.closeCallOptions);
  const openScheduleModal = useCallStore((s) => s.openScheduleModal);
  const startCall        = useCallStore((s) => s.startCall);
  const hasPhoneCaptured = useLeadStore((s) => s.phoneCapture);

  const handleStartCall = () => {
    if (hasPhoneCaptured) { startCall(); }
    else { setShowPhoneGate(true); }
  };
  const handlePhoneCaptured = () => { setShowPhoneGate(false); startCall(); };
  const handleScheduleClick = () => { closeCallOptions(); openScheduleModal(); };
  const handleEmailClick    = () => { closeCallOptions(); window.location.href = '/contact#email'; };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed', inset: 0,
              zIndex: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '16px',
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCallOptions}
              style={{
                position: 'absolute', inset: 0,
                backgroundColor: 'rgba(10,10,10,0.55)',
                backdropFilter: 'blur(6px)',
              }}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.45, ease: EASE }}
              style={{
                position: 'relative',
                backgroundColor: '#fafaf8',
                width: '100%',
                maxWidth: 700,
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 32px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.08)',
              }}
            >
              {/* Top border accent */}
              <div style={{ height: 2, backgroundColor: '#c8a96e', width: '100%' }} />

              {/* Header */}
              <div style={{
                padding: '32px 36px 24px',
                borderBottom: '1px solid rgba(10,10,10,0.08)',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                gap: 16,
              }}>
                <div>
                  {/* Eyebrow */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <motion.span
                      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 9, letterSpacing: '0.22em',
                        textTransform: 'uppercase' as const,
                        color: '#b8b5ae', fontWeight: 600,
                      }}
                    >
                      Get in Touch
                    </motion.span>
                    <motion.div
                      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                      style={{ height: 1, width: 36, backgroundColor: '#c8a96e', transformOrigin: 'left' }}
                    />
                  </div>

                  <motion.h2
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 'clamp(24px, 3vw, 34px)',
                      fontWeight: 700, lineHeight: 1.05,
                      letterSpacing: '-0.02em',
                      color: '#0a0a0a', margin: 0,
                    }}
                  >
                    Connect With
                    <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#b8b5ae' }}> Our Team</em>
                  </motion.h2>
                </div>

                {/* Close button */}
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={closeCallOptions}
                  aria-label="Close"
                  style={{
                    width: 36, height: 36, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(10,10,10,0.12)',
                    background: 'none', cursor: 'pointer',
                    color: '#888880', transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(200,169,110,0.45)'; e.currentTarget.style.color = '#c8a96e'; }}
                  onMouseOut={(e)  => { e.currentTarget.style.borderColor = 'rgba(10,10,10,0.12)';    e.currentTarget.style.color = '#888880'; }}
                >
                  <X size={15} />
                </motion.button>
              </div>

              {/* Body */}
              <div style={{ padding: '28px 36px 36px' }}>

                <AnimatePresence mode="wait">
                  {showPhoneGate ? (
                    /* Phone gate */
                    <motion.div
                      key="phone-gate"
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <PhoneCaptureGate
                        onCaptured={handlePhoneCaptured}
                        onCancel={() => setShowPhoneGate(false)}
                      />
                    </motion.div>
                  ) : (
                    /* Option cards */
                    <motion.div
                      key="options"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.p
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13, fontWeight: 300,
                          color: '#888880', lineHeight: 1.75,
                          marginBottom: 28,
                        }}
                      >
                        Choose how you'd like to connect — we're available across every channel, every day.
                      </motion.p>

                      {/* Two option cards */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                        gap: 1,
                        backgroundColor: 'rgba(10,10,10,0.08)',
                        marginBottom: 28,
                      }}>
                        <div style={{ backgroundColor: '#fafaf8' }}>
                          <OptionCard
                            icon={Mic}
                            number="01"
                            title="Talk to an Agent"
                            description="Instant AI voice call with a real estate expert. Available 24 hours a day, every day of the year."
                            cta="Start Now"
                            delay={0.15}
                            onClick={handleStartCall}
                          />
                        </div>
                        <div style={{ backgroundColor: '#fafaf8' }}>
                          <OptionCard
                            icon={Calendar}
                            number="02"
                            title="Schedule a Meeting"
                            description="Pick a date and time that suits you perfectly. We'll confirm within the hour and come prepared."
                            cta="Pick a Time"
                            delay={0.25}
                            onClick={handleScheduleClick}
                          />
                        </div>
                      </div>

                      {/* Email link */}
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          paddingTop: 20,
                          borderTop: '1px solid rgba(10,10,10,0.07)',
                        }}
                      >
                        <button
                          onClick={handleEmailClick}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 11, letterSpacing: '0.12em',
                            textTransform: 'uppercase' as const,
                            color: '#b8b5ae', fontWeight: 500,
                            transition: 'color 0.2s',
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.color = '#c8a96e'; }}
                          onMouseOut={(e)  => { e.currentTarget.style.color = '#b8b5ae'; }}
                        >
                          <Mail size={13} />
                          Prefer email? Send us a message
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}