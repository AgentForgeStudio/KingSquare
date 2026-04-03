'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, ArrowRight } from 'lucide-react';
import { useLeadStore } from '@/store/leadStore';
import { useExitIntent } from '@/hooks/useExitIntent';

// ─── Constants ─────────────────────────────────────────────────────────────────
const GOLD = '#c8a96e';
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface PhoneExitIntentProps {
  onShowChange?: (show: boolean) => void;
}

export function PhoneExitIntent({ onShowChange }: PhoneExitIntentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [btnHov, setBtnHov] = useState(false);
  const [skipHov, setSkipHov] = useState(false);
  const markCaptured = useLeadStore((state) => state.markCaptured);

  const handleShowExitIntent = () => {
    setIsVisible(true);
    onShowChange?.(true);
  };

  useExitIntent({ enabled: !isVisible, onExitIntent: handleShowExitIntent });

  useEffect(() => { onShowChange?.(isVisible); }, [isVisible, onShowChange]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('find_exit_shown', 'true');
    onShowChange?.(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/phone-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, source: 'exit-intent', pageUrl: window.location.href, timestamp: new Date().toISOString() }),
      });
      if (response.ok) {
        markCaptured(phone, 'exit-intent');
        setIsSuccess(true);
        setTimeout(handleClose, 3000);
      }
    } catch (err) {
      console.error('Phone capture error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600&display=swap');
        @keyframes find-spin { to { transform: rotate(360deg); } }
        .find-spin { animation: find-spin 1s linear infinite; display: inline-block; }
        @keyframes find-line-in { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      `}</style>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.65)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.55, ease: EASE }}
              style={{ position: 'relative', background: '#fff', width: '100%', maxWidth: '520px', overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.22), 0 8px 32px rgba(0,0,0,0.12)' }}
            >

              {/* Gold top rule */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${GOLD} 20%, ${GOLD} 80%, transparent)`, transformOrigin: 'left' }}
              />

              {/* SVG corner ornament — top right */}
              <svg style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', opacity: 0.3, pointerEvents: 'none' }} viewBox="0 0 80 80" fill="none">
                <path d="M80 0 L80 80 L0 0 Z" fill={`${GOLD}22`} />
                <path d="M80 0 L80 48 L32 0" stroke={GOLD} strokeWidth="0.5" fill="none" />
              </svg>

              {/* SVG corner ornament — bottom left */}
              <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '80px', height: '80px', opacity: 0.3, pointerEvents: 'none', transform: 'rotate(180deg)' }} viewBox="0 0 80 80" fill="none">
                <path d="M80 0 L80 80 L0 0 Z" fill={`${GOLD}22`} />
                <path d="M80 0 L80 48 L32 0" stroke={GOLD} strokeWidth="0.5" fill="none" />
              </svg>

              {/* Dismiss button */}
              <button
                onClick={handleClose}
                aria-label="Close"
                style={{ position: 'absolute', top: '20px', right: '20px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid #e5e5e5', cursor: 'pointer', color: '#a3a3a3', zIndex: 10, transition: 'border-color 0.2s, color 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0a0a0a'; (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e5e5'; (e.currentTarget as HTMLElement).style.color = '#a3a3a3'; }}
              >
                <X size={13} />
              </button>

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ padding: '56px 48px 48px' }}
                  >
                    {/* Section label */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
                      <div style={{ height: '1px', width: '32px', background: GOLD, flexShrink: 0 }} />
                      <span style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: GOLD, fontFamily: "'Inter', sans-serif", fontWeight: 600, whiteSpace: 'nowrap' }}>
                        Before You Leave
                      </span>
                    </div>

                    {/* Headline */}
                    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 700, color: '#0a0a0a', lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: '8px' }}>
                      Get Your Free
                    </h2>
                    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: '24px' }}>
                      <em style={{ fontStyle: 'italic', color: GOLD }}>Property Report</em>
                    </h2>

                    {/* Body */}
                    <p style={{ fontSize: '0.875rem', color: '#737373', lineHeight: 1.8, fontWeight: 300, fontFamily: "'Inter', sans-serif", marginBottom: '36px', maxWidth: '380px' }}>
                      Share your number and we'll send a personalised report of the finest luxury properties matched to your budget — directly on WhatsApp.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                      <div style={{ display: 'flex', gap: '0', marginBottom: '12px', border: inputFocused ? `1px solid ${GOLD}` : '1px solid #e5e5e5', transition: 'border-color 0.25s' }}>
                        {/* Country prefix */}
                        <div style={{ padding: '14px 16px', background: '#fafaf8', borderRight: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: '0.875rem', color: '#737373', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>+91</span>
                        </div>
                        {/* Input */}
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          onFocus={() => setInputFocused(true)}
                          onBlur={() => setInputFocused(false)}
                          placeholder="Your mobile number"
                          required
                          style={{ flex: 1, padding: '14px 16px', background: '#fff', border: 'none', outline: 'none', fontSize: '0.875rem', color: '#0a0a0a', fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting || phone.length < 10}
                        onMouseEnter={() => setBtnHov(true)}
                        onMouseLeave={() => setBtnHov(false)}
                        style={{
                          width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                          background: phone.length < 10 ? '#e5e5e5' : btnHov ? '#0a0a0a' : GOLD,
                          color: phone.length < 10 ? '#a3a3a3' : '#fff',
                          border: 'none', cursor: phone.length < 10 ? 'not-allowed' : 'pointer',
                          fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 600,
                          letterSpacing: '0.15em', textTransform: 'uppercase' as const,
                          transition: 'background 0.3s cubic-bezier(0.22,1,0.36,1), color 0.3s',
                          marginBottom: '16px',
                        }}
                      >
                        {isSubmitting
                          ? <span className="find-spin" style={{ fontSize: '16px' }}>◌</span>
                          : <><Send size={13} /> Send My Free Report</>
                        }
                      </button>
                    </form>

                    {/* Skip */}
                    <div style={{ textAlign: 'center' }}>
                      <button
                        onClick={handleClose}
                        onMouseEnter={() => setSkipHov(true)}
                        onMouseLeave={() => setSkipHov(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: skipHov ? '#737373' : '#c5c5c5', fontFamily: "'Inter', sans-serif", transition: 'color 0.2s' }}
                      >
                        No thanks, I'll pass
                      </button>
                    </div>

                    {/* Trust footnote */}
                    <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                      {['2,500+ Properties', '15+ Years', '500+ Agents'].map((item, i, arr) => (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#c5c5c5', fontFamily: "'Inter', sans-serif" }}>{item}</span>
                          {i < arr.length - 1 && <div style={{ width: '3px', height: '3px', background: GOLD, borderRadius: '50%', flexShrink: 0 }} />}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    style={{ padding: '72px 48px', textAlign: 'center' }}
                  >
                    {/* Animated checkmark circle */}
                    <div style={{ width: '64px', height: '64px', border: `1px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
                      <CheckCircle size={28} style={{ color: GOLD }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center', marginBottom: '20px' }}>
                      <div style={{ height: '1px', width: '32px', background: GOLD }} />
                      <span style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: GOLD, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Report Sent</span>
                      <div style={{ height: '1px', width: '32px', background: GOLD }} />
                    </div>

                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', marginBottom: '12px', lineHeight: 1 }}>
                      On its way to your<br />
                      <em style={{ fontStyle: 'italic', color: GOLD }}>WhatsApp</em>
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#a3a3a3', fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: 1.7 }}>
                      Our senior agent will be in touch shortly with your personalised property report.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Gold bottom rule */}
              <div style={{ height: '1px', background: '#f0ece4' }} />

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}