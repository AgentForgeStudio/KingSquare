'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle } from 'lucide-react';
import { useLeadStore } from '@/store/leadStore';
import { usePhoneCapture } from '@/hooks/usePhoneCapture';

const GOLD = '#c8a96e';
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function PhoneSlideIn() {
  const [isVisible, setIsVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [btnHov, setBtnHov] = useState(false);
  const markCaptured = useLeadStore((s) => s.markCaptured);
  const { shouldShowSlideIn, dismissSlideIn } = usePhoneCapture();

  useEffect(() => {
    const handleShow = () => {
      if (shouldShowSlideIn()) setIsVisible(true);
    };
    window.addEventListener('showPhoneSlideIn', handleShow);
    handleShow();
    return () => window.removeEventListener('showPhoneSlideIn', handleShow);
  }, [shouldShowSlideIn]);

  const handleClose = () => {
    setIsVisible(false);
    dismissSlideIn();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/phone-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, source: 'slide-in-45s', pageUrl: window.location.href, timestamp: new Date().toISOString() }),
      });
      if (res.ok) {
        markCaptured(phone, 'slide-in-45s');
        setIsSuccess(true);
        setTimeout(handleClose, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=Inter:wght@300;400;500;600&display=swap'); @keyframes fs { to { transform: rotate(360deg); } } .fs { animation: fs 1s linear infinite; display:inline-block; }`}</style>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 40, y: 16 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 40, y: 16 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ position: 'fixed', bottom: '96px', right: '24px', zIndex: 50, width: '320px', maxWidth: 'calc(100vw - 2rem)' }}
          >
            <div style={{ background: '#fff', boxShadow: '0 24px 80px rgba(0,0,0,0.14), 0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden', position: 'relative' }}>

              {/* Gold top bar */}
              <div style={{ height: '2px', background: `linear-gradient(90deg, transparent, ${GOLD} 30%, ${GOLD} 70%, transparent)` }} />

              {/* Corner ornament */}
              <svg style={{ position: 'absolute', top: 2, right: 0, width: '56px', height: '56px', opacity: 0.25, pointerEvents: 'none' }} viewBox="0 0 56 56" fill="none">
                <path d="M56 0 L56 56 L0 0 Z" fill={`${GOLD}30`} />
                <path d="M56 0 L56 34 L22 0" stroke={GOLD} strokeWidth="0.5" fill="none" />
              </svg>

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '24px' }}>

                    {/* Dismiss */}
                    <button onClick={handleClose} aria-label="Close"
                      style={{ position: 'absolute', top: '14px', right: '12px', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid #e5e5e5', cursor: 'pointer', color: '#a3a3a3', transition: 'border-color 0.2s, color 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0a0a0a'; (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e5e5'; (e.currentTarget as HTMLElement).style.color = '#a3a3a3'; }}>
                      <X size={11} />
                    </button>

                    {/* Label */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                      <div style={{ height: '1px', width: '20px', background: GOLD, flexShrink: 0 }} />
                      <span style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: GOLD, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>New Listings Alert</span>
                    </div>

                    {/* Headline */}
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#0a0a0a', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                      Get Matched to
                    </h3>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', marginBottom: '12px' }}>
                      <em style={{ fontStyle: 'italic', color: GOLD }}>Your Dream Home</em>
                    </h3>

                    <p style={{ fontSize: '0.8rem', color: '#737373', lineHeight: 1.7, fontFamily: "'Inter', sans-serif", fontWeight: 300, marginBottom: '20px' }}>
                      We'll WhatsApp you exclusive listings the moment they hit the market.
                    </p>

                    <form onSubmit={handleSubmit}>
                      <div style={{ display: 'flex', marginBottom: '10px', border: inputFocused ? `1px solid ${GOLD}` : '1px solid #e5e5e5', transition: 'border-color 0.25s' }}>
                        <div style={{ padding: '10px 12px', background: '#fafaf8', borderRight: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: '0.8rem', color: '#737373', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>+91</span>
                        </div>
                        <input
                          type="tel" value={phone}
                          onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)}
                          placeholder="98765 43210" required
                          style={{ flex: 1, padding: '10px 12px', border: 'none', outline: 'none', background: '#fff', fontSize: '0.8rem', color: '#0a0a0a', fontFamily: "'Inter', sans-serif" }}
                        />
                      </div>
                      <button
                        type="submit" disabled={isSubmitting || phone.length < 10}
                        onMouseEnter={() => setBtnHov(true)} onMouseLeave={() => setBtnHov(false)}
                        style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: phone.length < 10 ? '#e5e5e5' : btnHov ? '#0a0a0a' : GOLD, color: phone.length < 10 ? '#a3a3a3' : '#fff', border: 'none', cursor: phone.length < 10 ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' as const, transition: 'background 0.3s', marginBottom: '10px' }}>
                        {isSubmitting ? <span className="fs">◌</span> : <><Send size={11} /> Send Me Properties</>}
                      </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#c5c5c5', fontFamily: "'Inter', sans-serif" }}>
                      No spam &nbsp;·&nbsp; Unsubscribe anytime
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="success" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}
                    style={{ padding: '32px 24px', textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', border: `1px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <CheckCircle size={22} style={{ color: GOLD }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ height: '1px', width: '20px', background: GOLD }} />
                      <span style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: GOLD, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Confirmed</span>
                      <div style={{ height: '1px', width: '20px', background: GOLD }} />
                    </div>
                    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                      Watch your <em style={{ fontStyle: 'italic', color: GOLD }}>WhatsApp</em><br />for new listings
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom rule */}
              <div style={{ height: '1px', background: '#f0ece4' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}