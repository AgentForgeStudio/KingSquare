'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Check } from 'lucide-react';
import { useLeadStore } from '@/store/leadStore';

// ─── Easing ────────────────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Tokens ────────────────────────────────────────────────────────────────────
const T = {
  gold:       '#c8a96e',
  goldBorder: 'rgba(200,169,110,0.38)',
  goldHover:  'rgba(200,169,110,0.10)',
  none:       'rgba(0,0,0,0)',
  bg:         '#fafaf8',
  surface:    '#f3f1ed',
  black:      '#0a0a0a',
  text:       '#0a0a0a',
  mid:        '#888880',
  dim:        '#b8b5ae',
  border:     'rgba(10,10,10,0.10)',
  borderHov:  'rgba(10,10,10,0.22)',
  serif:      "'Playfair Display', Georgia, serif",
  sans:       "'DM Sans', sans-serif",
};

interface PhoneCaptureGateProps {
  onCaptured: () => void;
  onCancel:   () => void;
}

export function PhoneCaptureGate({ onCaptured, onCancel }: PhoneCaptureGateProps) {
  const [phone, setPhone]           = useState('');
  const [focused, setFocused]       = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSuccess, setSuccess]     = useState(false);
  const [error, setError]           = useState('');

  const markCaptured = useLeadStore((s) => s.markCaptured);

  const canSubmit = phone.length >= 10 && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/phone-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          source:    'call-gate',
          pageUrl:   window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        markCaptured(phone, 'call-gate');
        setSuccess(true);
        // Brief success flash before proceeding
        setTimeout(() => onCaptured(), 700);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        exit={{   opacity: 0, y: -10, scale: 0.98  }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{
          backgroundColor: T.bg,
          border: `1px solid ${T.border}`,
          overflow: 'hidden',
          width: '100%',
          // Responsive max-width handled by parent
        }}
      >
        {/* Gold top accent */}
        <div style={{ height: 2, backgroundColor: T.gold }} />

        <AnimatePresence mode="wait">

          {/* ── Success state ── */}
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              style={{
                padding: 'clamp(20px, 5vw, 32px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', gap: 16,
              }}
            >
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, delay: 0.1 }}
                style={{
                  width: 48, height: 48,
                  border: `1px solid ${T.goldBorder}`,
                  backgroundColor: T.goldHover,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Check size={20} style={{ color: T.gold }} />
              </motion.div>
              <p style={{
                fontFamily: T.serif, fontSize: 'clamp(16px, 3vw, 20px)',
                fontStyle: 'italic', fontWeight: 400,
                color: T.text, margin: 0,
              }}>
                Connecting you now…
              </p>
            </motion.div>

          ) : (

            /* ── Form state ── */
            <motion.div
              key="form"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div style={{
                padding: 'clamp(16px, 4vw, 24px) clamp(16px, 4vw, 28px) clamp(12px, 3vw, 18px)',
                borderBottom: `1px solid ${T.border}`,
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
              }}>
                <div>
                  {/* Eyebrow */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <motion.span
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
                      style={{
                        fontFamily: T.sans, fontSize: 9, letterSpacing: '0.22em',
                        textTransform: 'uppercase' as const, color: T.dim, fontWeight: 600,
                      }}
                    >
                      Quick Verification
                    </motion.span>
                    <motion.div
                      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                      transition={{ duration: 0.55, delay: 0.18, ease: EASE }}
                      style={{ height: 1, width: 24, backgroundColor: T.gold, transformOrigin: 'left' }}
                    />
                  </div>

                  {/* Title */}
                  <motion.h4
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                    style={{
                      fontFamily: T.serif,
                      fontSize: 'clamp(18px, 3.5vw, 22px)',
                      fontWeight: 700, lineHeight: 1.1,
                      letterSpacing: '-0.01em', color: T.text, margin: 0,
                    }}
                  >
                    One step to
                    <em style={{ fontStyle: 'italic', fontWeight: 400, color: T.dim }}> connect</em>
                  </motion.h4>
                </div>

                {/* Close */}
                <button
                  onClick={onCancel}
                  style={{
                    width: 30, height: 30, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${T.border}`, background: 'none',
                    cursor: 'pointer', color: T.mid, transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = T.goldBorder; e.currentTarget.style.color = T.gold; }}
                  onMouseOut={(e)  => { e.currentTarget.style.borderColor = T.border;     e.currentTarget.style.color = T.mid; }}
                  aria-label="Cancel"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: 'clamp(16px, 4vw, 24px) clamp(16px, 4vw, 28px) clamp(20px, 5vw, 28px)' }}>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
                  style={{
                    fontFamily: T.sans, fontSize: 'clamp(12px, 2vw, 13px)',
                    fontWeight: 300, color: T.mid, lineHeight: 1.75,
                    margin: '0 0 clamp(16px, 4vw, 22px)',
                  }}
                >
                  Share your number so we can connect you with an agent instantly. Takes 10 seconds.
                </motion.p>

                {/* Form */}
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                >
                  {/* Phone input row */}
                  <div>
                    <p style={{
                      fontFamily: T.sans, fontSize: 9, letterSpacing: '0.2em',
                      textTransform: 'uppercase' as const, color: T.mid, margin: '0 0 8px', fontWeight: 600,
                    }}>
                      Mobile Number
                    </p>

                    <div style={{ display: 'flex', position: 'relative' }}>
                      {/* Prefix */}
                      <div style={{
                        padding: '11px 14px',
                        border: `1px solid ${focused ? T.goldBorder : T.border}`,
                        borderRight: 'none',
                        backgroundColor: T.surface,
                        color: T.mid, fontFamily: T.sans,
                        fontSize: 13, fontWeight: 300, flexShrink: 0,
                        transition: 'border-color 0.25s',
                      }}>
                        +91
                      </div>

                      {/* Input */}
                      <div style={{ flex: 1, position: 'relative' }}>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          onFocus={() => setFocused(true)}
                          onBlur={() => setFocused(false)}
                          placeholder="98765 43210"
                          required
                          style={{
                            width: '100%',
                            padding: '11px 14px',
                            backgroundColor: T.bg,
                            border: `1px solid ${focused ? T.goldBorder : T.border}`,
                            color: T.text, fontFamily: T.sans,
                            fontSize: 13, fontWeight: 300,
                            outline: 'none', boxSizing: 'border-box' as const,
                            transition: 'border-color 0.25s',
                            caretColor: T.gold,
                          }}
                        />
                        {/* Focus underline */}
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, height: 1,
                          backgroundColor: T.gold,
                          width: focused ? '100%' : '0%',
                          transition: 'width 0.35s ease',
                          pointerEvents: 'none',
                        }} />
                      </div>
                    </div>

                    {/* Progress bar below input */}
                    <div style={{ height: 1, backgroundColor: 'rgba(10,10,10,0.07)', marginTop: 6, position: 'relative', overflow: 'hidden' }}>
                      <motion.div
                        animate={{ scaleX: phone.length / 10 }}
                        transition={{ duration: 0.2, ease: EASE }}
                        style={{ position: 'absolute', inset: 0, backgroundColor: T.gold, transformOrigin: 'left' }}
                      />
                    </div>
                    <p style={{
                      fontFamily: T.sans, fontSize: 9, color: T.dim,
                      margin: '5px 0 0', letterSpacing: '0.1em',
                      textAlign: 'right' as const,
                    }}>
                      {phone.length}/10 digits
                    </p>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        style={{
                          fontFamily: T.sans, fontSize: 11, color: '#c85050',
                          margin: 0, padding: '7px 12px',
                          border: '1px solid rgba(200,80,80,0.2)',
                          backgroundColor: 'rgba(200,80,80,0.05)',
                        }}
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    style={{
                      width: '100%', padding: 'clamp(12px, 3vw, 14px)',
                      backgroundColor: canSubmit ? T.black : T.none,
                      border: `1px solid ${canSubmit ? T.black : T.border}`,
                      color: canSubmit ? '#fafaf8' : T.dim,
                      fontFamily: T.sans, fontSize: 10, letterSpacing: '0.2em',
                      textTransform: 'uppercase' as const, fontWeight: 600,
                      cursor: canSubmit ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'all 0.25s',
                    }}
                  >
                    {isSubmitting ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{ display: 'inline-block', fontSize: 14 }}
                      >
                        ◌
                      </motion.span>
                    ) : (
                      <>
                        Continue to Call
                        <span style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: 26, height: 26,
                          border: `1px solid ${canSubmit ? 'rgba(255,255,255,0.2)' : T.border}`,
                          overflow: 'hidden', position: 'relative',
                        }}>
                          <ArrowRight size={12} />
                        </span>
                      </>
                    )}
                  </button>

                  {/* Privacy note */}
                  <p style={{
                    fontFamily: T.sans, fontSize: 9, letterSpacing: '0.08em',
                    color: T.dim, textAlign: 'center' as const, margin: 0, lineHeight: 1.6,
                  }}>
                    Your number is only used to connect this call. We never share it.
                  </p>
                </motion.form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}