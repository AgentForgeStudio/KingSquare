'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// ── tokens ────────────────────────────────────────────────────
const gold       = '#C9A84C';
const goldDim    = 'rgba(201,168,76,0.10)';
const goldBorder = 'rgba(201,168,76,0.38)';
const surface    = '#121212';
const white      = '#F4F1EB';
const mid        = 'rgba(244,241,235,0.45)';
const dim        = 'rgba(244,241,235,0.20)';
const border     = 'rgba(255,255,255,0.08)';
const serif      = "'Cormorant Garamond','Playfair Display',Georgia,serif";
const sans       = "'Helvetica Neue',Arial,sans-serif";

const SUBJECTS = [
  'General Inquiry',
  'Property Question',
  'Investment',
  'Viewing Request',
  'Other',
];

// ── Field label ───────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: sans, fontSize: 9, letterSpacing: '0.22em',
      textTransform: 'uppercase', color: gold, fontWeight: 700,
      margin: '0 0 9px',
    }}>
      {children}
    </p>
  );
}

// ── Input with animated focus underline ───────────────────────
function StyledInput({
  value, onChange, placeholder, type = 'text', required,
}: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '11px 14px', boxSizing: 'border-box',
          backgroundColor: surface,
          border: `1px solid ${focused ? goldBorder : border}`,
          color: white, fontFamily: sans, fontSize: 13,
          letterSpacing: '0.02em', outline: 'none',
          transition: 'border-color 0.25s',
        }}
      />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, height: 1,
        background: gold, width: focused ? '100%' : '0%',
        transition: 'width 0.35s ease',
      }} />
    </div>
  );
}

// ── Success screen ────────────────────────────────────────────
function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
        padding: '60px 32px',
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 220, delay: 0.15 }}
        style={{
          width: 72, height: 72, borderRadius: '50%',
          border: `2px solid ${gold}`,
          backgroundColor: goldDim,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 28,
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
          stroke={gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </motion.div>

      <h3 style={{
        fontFamily: serif, fontSize: 28, fontWeight: 400,
        fontStyle: 'italic', color: white, margin: '0 0 14px',
      }}>
        Message Sent
      </h3>

      <div style={{ width: 32, height: 1, backgroundColor: gold, margin: '0 auto 18px' }} />

      <p style={{
        fontFamily: sans, fontSize: 13, color: mid,
        lineHeight: 1.65, maxWidth: 300,
      }}>
        Thank you for reaching out. Our team will respond within 24 hours.
      </p>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────
export function DirectEmailForm() {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', subject: '', message: '',
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSuccess, setSuccess]       = useState(false);
  const [error, setError]             = useState('');

  const patch = (partial: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...partial }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });
      if (res.ok) setSuccess(true);
      else setError('Failed to send. Please try again.');
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isSuccess) return <SuccessScreen />;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Name + Phone — side by side on md+ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16,
      }}>
        <div>
          <FieldLabel>Full Name</FieldLabel>
          <StyledInput required value={formData.name} onChange={(v) => patch({ name: v })} placeholder="Rahul Sharma" />
        </div>
        <div>
          <FieldLabel>Phone (required)</FieldLabel>
          <StyledInput
            required type="tel"
            value={formData.phone}
            onChange={(v) => patch({ phone: v.replace(/\D/g, '').slice(0, 10) })}
            placeholder="98765 43210"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <FieldLabel>Email Address</FieldLabel>
        <StyledInput required type="email" value={formData.email} onChange={(v) => patch({ email: v })} placeholder="rahul@example.com" />
      </div>

      {/* Subject — custom select */}
      <div>
        <FieldLabel>Subject</FieldLabel>
        <div style={{ position: 'relative' }}>
          <select
            required
            value={formData.subject}
            onChange={(e) => patch({ subject: e.target.value })}
            style={{
              width: '100%', padding: '11px 14px',
              backgroundColor: surface,
              border: `1px solid ${formData.subject ? goldBorder : border}`,
              color: formData.subject ? white : mid,
              fontFamily: sans, fontSize: 13, letterSpacing: '0.02em',
              outline: 'none', appearance: 'none', cursor: 'pointer',
              transition: 'border-color 0.25s',
            }}
            onFocus={(e) => { e.target.style.borderColor = goldBorder; }}
            onBlur={(e) => { e.target.style.borderColor = formData.subject ? goldBorder : border; }}
          >
            <option value="" disabled>Select a subject</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s} style={{ backgroundColor: '#121212', color: white }}>{s}</option>
            ))}
          </select>
          {/* Chevron */}
          <div style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            pointerEvents: 'none', color: gold,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <FieldLabel>Message</FieldLabel>
        <div style={{ position: 'relative' }}>
          <textarea
            required
            rows={5}
            value={formData.message}
            onChange={(e) => patch({ message: e.target.value })}
            placeholder="How can we help you today?"
            style={{
              width: '100%', padding: '11px 14px', boxSizing: 'border-box',
              backgroundColor: surface,
              border: `1px solid ${border}`,
              color: white, fontFamily: sans, fontSize: 13, letterSpacing: '0.02em',
              outline: 'none', resize: 'none',
              transition: 'border-color 0.25s',
            }}
            onFocus={(e) => { e.target.style.borderColor = goldBorder; }}
            onBlur={(e) => { e.target.style.borderColor = border; }}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p style={{
          fontFamily: sans, fontSize: 11, color: '#e07070',
          letterSpacing: '0.04em', margin: 0,
        }}>
          {error}
        </p>
      )}

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileTap={{ scale: 0.97 }}
        style={{
          width: '100%', padding: '14px',
          backgroundColor: isSubmitting ? '#1c1c1c' : gold,
          border: `1px solid ${isSubmitting ? border : gold}`,
          color: isSubmitting ? dim : '#080808',
          fontFamily: sans, fontSize: 10, letterSpacing: '0.22em',
          textTransform: 'uppercase', fontWeight: 700,
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.25s',
        }}
      >
        {isSubmitting ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            style={{ display: 'inline-block' }}
          >
            ◌
          </motion.span>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Send Message
          </>
        )}
      </motion.button>
    </form>
  );
}

export default DirectEmailForm;