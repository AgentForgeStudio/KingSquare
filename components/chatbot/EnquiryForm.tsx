'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLeadStore } from '@/store/leadStore';

// ── tokens ────────────────────────────────────────────────────
const gold        = '#C9A84C';
const goldDim     = 'rgba(201,168,76,0.1)';
const goldBorder  = 'rgba(201,168,76,0.38)';
const bg          = '#0a0a0a';
const surface     = '#121212';
const surfaceHigh = '#1a1a1a';
const white       = '#F4F1EB';
const mid         = 'rgba(244,241,235,0.45)';
const dim         = 'rgba(244,241,235,0.20)';
const border      = 'rgba(255,255,255,0.08)';
const serif       = "'Cormorant Garamond','Playfair Display',Georgia,serif";
const sans        = "'Helvetica Neue',Arial,sans-serif";

const PROPERTY_TYPES = ['Apartment','Villa','Penthouse','Estate','Townhouse'];
const ENQUIRY_TYPES  = [
  { id: 'buy',        label: 'Buy Property' },
  { id: 'rent',       label: 'Rent Property' },
  { id: 'sell',       label: 'Sell My Property' },
  { id: 'investment', label: 'Investment Advice' },
];

// ── Reusable field label ──────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: sans, fontSize: 9, letterSpacing: '0.22em',
      textTransform: 'uppercase', color: gold, fontWeight: 700,
      margin: '0 0 10px',
    }}>
      {children}
    </p>
  );
}

// ── Styled text input ─────────────────────────────────────────
function StyledInput({
  value, onChange, placeholder, type = 'text', disabled,
}: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%', padding: '11px 14px',
          backgroundColor: surface,
          border: `1px solid ${focused ? goldBorder : border}`,
          color: white, fontFamily: sans, fontSize: 13,
          letterSpacing: '0.02em', outline: 'none',
          transition: 'border-color 0.25s', boxSizing: 'border-box',
          opacity: disabled ? 0.5 : 1,
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onMouseOver={(e) => { (e.target as any).style.borderColor = focused ? goldBorder : 'rgba(255,255,255,0.15)'; }}
        onMouseOut={(e) => { (e.target as any).style.borderColor = focused ? goldBorder : border; }}
      />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, height: 1,
        background: gold, width: focused ? '100%' : '0%',
        transition: 'width 0.35s ease',
      }} />
    </div>
  );
}

// ── Format budget display ─────────────────────────────────────
function fmt(v: number) {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000)   return `₹${(v / 100000).toFixed(0)}L`;
  return `₹${v.toLocaleString()}`;
}

// ── Success screen ────────────────────────────────────────────
function SuccessScreen({ name, phone }: { name: string; phone: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', textAlign: 'center',
      }}
    >
      {/* Gold checkmark circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.15, stiffness: 200 }}
        style={{
          width: 64, height: 64, borderRadius: '50%',
          border: `2px solid ${gold}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24, backgroundColor: goldDim,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke={gold} strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </motion.div>

      <h3 style={{
        fontFamily: serif, fontSize: 24, fontWeight: 400,
        fontStyle: 'italic', color: white, margin: '0 0 12px',
      }}>
        Enquiry Received
      </h3>

      <div style={{ width: 32, height: 1, backgroundColor: gold, margin: '0 auto 16px' }} />

      <p style={{ fontFamily: sans, fontSize: 12, color: mid, margin: '0 0 8px', lineHeight: 1.65 }}>
        We'll reach out to <strong style={{ color: white }}>{name}</strong><br />
        at <strong style={{ color: gold }}>+91 {phone}</strong> within 24 hours.
      </p>

      <a href="/properties" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        marginTop: 28, padding: '9px 22px',
        border: `1px solid ${goldBorder}`, backgroundColor: 'transparent',
        color: gold, fontFamily: sans, fontSize: 10,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        fontWeight: 700, textDecoration: 'none',
        transition: 'all 0.25s',
      }}>
        Browse Properties →
      </a>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────
export function EnquiryForm() {
  const [step, setStep]             = useState(1);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSuccess, setSuccess]     = useState(false);
  const [formData, setFormData]     = useState({
    enquiryType:  '',
    propertyTypes: [] as string[],
    budgetMin:    5000000,
    budgetMax:    50000000,
    location:     '',
    name:         '',
    phone:        '',
    email:        '',
    message:      '',
  });

  const markCaptured = useLeadStore((s) => s.markCaptured);
  const setLead      = useLeadStore((s) => s.setLead);

  const patch = (partial: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...partial }));

  const togglePropType = (t: string) =>
    patch({
      propertyTypes: formData.propertyTypes.includes(t)
        ? formData.propertyTypes.filter((x) => x !== t)
        : [...formData.propertyTypes, t],
    });

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PROPERTY_ENQUIRY',
          ...formData,
          propertyTypes: formData.propertyTypes.join(', '),
          source: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        markCaptured(formData.phone, 'enquiry-form');
        setLead({ name: formData.name, email: formData.email, phone: formData.phone });
        setSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (isSuccess) return <SuccessScreen name={formData.name} phone={formData.phone} />;

  return (
    <div style={{ padding: '4px 0' }}>

      {/* ── Step indicator ── */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <p style={{
          fontFamily: sans, fontSize: 9, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: dim, margin: '0 0 10px',
        }}>
          Step {step} of 2
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {[1, 2].map((s) => (
            <motion.div
              key={s}
              animate={{ backgroundColor: s <= step ? gold : 'rgba(255,255,255,0.1)' }}
              transition={{ duration: 0.3 }}
              style={{ height: 2, width: 40 }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
          >
            {/* Enquiry type */}
            <div>
              <FieldLabel>Enquiry Type</FieldLabel>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
              }}>
                {ENQUIRY_TYPES.map((t) => {
                  const active = formData.enquiryType === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => patch({ enquiryType: t.id })}
                      style={{
                        padding: '10px 12px',
                        border: `1px solid ${active ? gold : border}`,
                        backgroundColor: active ? goldDim : surface,
                        color: active ? gold : mid,
                        fontFamily: sans, fontSize: 11,
                        letterSpacing: '0.04em', fontWeight: active ? 700 : 400,
                        cursor: 'pointer', transition: 'all 0.22s',
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Property types */}
            <div>
              <FieldLabel>Property Type</FieldLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {PROPERTY_TYPES.map((t) => {
                  const active = formData.propertyTypes.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => togglePropType(t)}
                      style={{
                        padding: '7px 14px',
                        border: `1px solid ${active ? gold : border}`,
                        backgroundColor: active ? goldDim : 'transparent',
                        color: active ? gold : mid,
                        fontFamily: sans, fontSize: 11, letterSpacing: '0.06em',
                        fontWeight: active ? 700 : 400,
                        cursor: 'pointer', transition: 'all 0.22s',
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget range */}
            <div>
              <FieldLabel>Budget Range</FieldLabel>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 12,
              }}>
                <span style={{ fontFamily: serif, fontSize: 16, fontStyle: 'italic', color: gold }}>
                  {fmt(formData.budgetMin)}
                </span>
                <span style={{ fontFamily: sans, fontSize: 9, color: dim, letterSpacing: '0.1em' }}>TO</span>
                <span style={{ fontFamily: serif, fontSize: 16, fontStyle: 'italic', color: gold }}>
                  {fmt(formData.budgetMax)}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(['budgetMin', 'budgetMax'] as const).map((key) => (
                  <input
                    key={key}
                    type="range" min="5000000" max="500000000" step="5000000"
                    value={formData[key]}
                    onChange={(e) => patch({ [key]: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: gold }}
                  />
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <FieldLabel>Preferred Location</FieldLabel>
              <StyledInput
                value={formData.location}
                onChange={(v) => patch({ location: v })}
                placeholder="e.g. Naigaon, Naigaon South"
              />
            </div>

            {/* Next */}
            <motion.button
              onClick={() => setStep(2)}
              disabled={!formData.enquiryType}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%', padding: '13px',
                backgroundColor: formData.enquiryType ? gold : '#1c1c1c',
                border: `1px solid ${formData.enquiryType ? gold : border}`,
                color: formData.enquiryType ? '#080808' : dim,
                fontFamily: sans, fontSize: 10, letterSpacing: '0.2em',
                textTransform: 'uppercase', fontWeight: 700,
                cursor: formData.enquiryType ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.25s',
              }}
            >
              Continue
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <p style={{
              fontFamily: serif, fontSize: 15, fontStyle: 'italic',
              color: mid, textAlign: 'center', margin: '0 0 6px',
            }}>
              How should we reach you?
            </p>

            {/* Name */}
            <div>
              <FieldLabel>Full Name</FieldLabel>
              <StyledInput value={formData.name} onChange={(v) => patch({ name: v })} placeholder="Rahul Sharma" />
            </div>

            {/* Phone */}
            <div>
              <FieldLabel>Mobile Number</FieldLabel>
              <p style={{ fontFamily: sans, fontSize: 10, color: dim, margin: '0 0 8px', letterSpacing: '0.04em' }}>
                We'll send matching properties via WhatsApp
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{
                  padding: '11px 14px',
                  border: `1px solid ${border}`,
                  backgroundColor: surfaceHigh,
                  color: mid, fontFamily: sans, fontSize: 13,
                  flexShrink: 0,
                }}>
                  +91
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                  <StyledInput
                    type="tel"
                    value={formData.phone}
                    onChange={(v) => patch({ phone: v.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <FieldLabel>Email Address</FieldLabel>
              <StyledInput type="email" value={formData.email} onChange={(v) => patch({ email: v })} placeholder="rahul@example.com" />
            </div>

            {/* Message */}
            <div>
              <FieldLabel>Message (optional)</FieldLabel>
              <div style={{ position: 'relative' }}>
                <textarea
                  value={formData.message}
                  onChange={(e) => patch({ message: e.target.value })}
                  rows={3}
                  placeholder="Sea-facing, near school, parking required…"
                  style={{
                    width: '100%', padding: '11px 14px',
                    backgroundColor: surface,
                    border: `1px solid ${border}`,
                    color: white, fontFamily: sans, fontSize: 13,
                    letterSpacing: '0.02em', outline: 'none',
                    resize: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.25s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = goldBorder; }}
                  onBlur={(e) => { e.target.style.borderColor = border; }}
                />
              </div>
            </div>

            {/* Back + Submit */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: '13px 18px', flexShrink: 0,
                  border: `1px solid ${border}`,
                  backgroundColor: 'transparent', color: dim,
                  fontFamily: sans, fontSize: 10, letterSpacing: '0.16em',
                  textTransform: 'uppercase', cursor: 'pointer',
                  transition: 'all 0.22s',
                }}
              >
                ← Back
              </button>

              <motion.button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.phone || !formData.email || isSubmitting}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1, padding: '13px',
                  backgroundColor: (!formData.name || !formData.phone || !formData.email || isSubmitting)
                    ? '#1c1c1c' : gold,
                  border: `1px solid ${(!formData.name || !formData.phone || !formData.email) ? border : gold}`,
                  color: (!formData.name || !formData.phone || !formData.email || isSubmitting)
                    ? dim : '#080808',
                  fontFamily: sans, fontSize: 10, letterSpacing: '0.2em',
                  textTransform: 'uppercase', fontWeight: 700,
                  cursor: (!formData.name || !formData.phone || !formData.email) ? 'not-allowed' : 'pointer',
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
                    Send Enquiry
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EnquiryForm;