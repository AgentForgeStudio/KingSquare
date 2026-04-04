'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, X, ExternalLink, Calendar } from 'lucide-react';
import { useCallStore } from '@/store/callStore';
import { useLeadStore } from '@/store/leadStore';
import { format } from 'date-fns';

// ─── Easing ────────────────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Tokens ────────────────────────────────────────────────────────────────────
const T = {
  gold:       '#c8a96e',
  goldHover:  'rgba(200,169,110,0.10)',
  goldBorder: 'rgba(200,169,110,0.38)',
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

// ─── Time slots ────────────────────────────────────────────────────────────────
const TIME_SLOTS = [
  { time: '9:00 AM',  period: 'Morning' },
  { time: '10:00 AM', period: 'Morning' },
  { time: '11:00 AM', period: 'Morning' },
  { time: '12:00 PM', period: 'Morning' },
  { time: '2:00 PM',  period: 'Afternoon' },
  { time: '3:00 PM',  period: 'Afternoon' },
  { time: '4:00 PM',  period: 'Afternoon' },
  { time: '5:00 PM',  period: 'Afternoon' },
];

const STEP_LABELS = ['Date & Time', 'Your Details', 'Confirm'];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: T.sans, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: T.mid, fontWeight: 600, margin: '0 0 8px' }}>
      {children}
    </p>
  );
}

function StyledInput({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '11px 14px',
          backgroundColor: T.bg,
          border: `1px solid ${focused ? T.goldBorder : T.border}`,
          color: T.text, fontFamily: T.sans, fontSize: 13, fontWeight: 300,
          outline: 'none', transition: 'border-color 0.25s',
          boxSizing: 'border-box' as const, caretColor: T.gold,
        }}
      />
      <div style={{ position: 'absolute', bottom: 0, left: 0, height: 1, backgroundColor: T.gold, width: focused ? '100%' : '0%', transition: 'width 0.35s ease', pointerEvents: 'none' }} />
    </div>
  );
}

// ─── Calendar grid ─────────────────────────────────────────────────────────────
function CalendarGrid({ selectedDate, onSelect }: {
  selectedDate: Date | null;
  onSelect: (d: Date) => void;
}) {
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 1); return d;
  });

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const maxDate  = new Date(); maxDate.setDate(maxDate.getDate() + 60);

  const year  = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array(firstDay === 0 ? 6 : firstDay - 1).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div>
      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button onClick={() => setViewMonth(new Date(year, month - 1, 1))} style={{ background: 'none', border: `1px solid ${T.border}`, cursor: 'pointer', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.mid, transition: 'all 0.2s' }}>
          ←
        </button>
        <p style={{ fontFamily: T.serif, fontSize: 16, fontWeight: 700, color: T.text, margin: 0, letterSpacing: '-0.01em' }}>
          {format(viewMonth, 'MMMM yyyy')}
        </p>
        <button onClick={() => setViewMonth(new Date(year, month + 1, 1))} style={{ background: 'none', border: `1px solid ${T.border}`, cursor: 'pointer', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.mid, transition: 'all 0.2s' }}>
          →
        </button>
      </div>

      {/* Day labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
        {DAY_LABELS.map((d) => (
          <div key={d} style={{ textAlign: 'center', fontFamily: T.sans, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: T.dim, padding: '4px 0', fontWeight: 600 }}>
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;

          const isSunday    = date.getDay() === 0;
          const isPast      = date < tomorrow;
          const isOutRange  = date > maxDate;
          const isDisabled  = isSunday || isPast || isOutRange;
          const isSelected  = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
          const isToday     = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

          return (
            <button
              key={i}
              onClick={() => !isDisabled && onSelect(date)}
              disabled={isDisabled}
              style={{
                aspectRatio: '1',
                border: isSelected ? `1px solid ${T.gold}` : isToday ? `1px solid rgba(200,169,110,0.35)` : `1px solid transparent`,
                backgroundColor: isSelected ? T.gold : T.none,
                color: isSelected ? '#fafaf8' : isDisabled ? 'rgba(10,10,10,0.18)' : isToday ? T.gold : T.text,
                fontFamily: T.sans, fontSize: 12, fontWeight: isSelected ? 600 : 400,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onMouseOver={(e) => { if (!isDisabled && !isSelected) e.currentTarget.style.borderColor = T.goldBorder; }}
              onMouseOut={(e)  => { if (!isDisabled && !isSelected) e.currentTarget.style.borderColor = 'transparent'; }}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Time chip ─────────────────────────────────────────────────────────────────
function TimeChip({ time, selected, onSelect }: { time: string; selected: boolean; onSelect: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '7px 14px',
        border: `1px solid ${selected ? T.goldBorder : hov ? T.borderHov : T.border}`,
        backgroundColor: selected ? T.goldHover : T.none,
        color: selected ? T.gold : hov ? T.text : T.mid,
        fontFamily: T.sans, fontSize: 11, letterSpacing: '0.06em',
        fontWeight: selected ? 600 : 400, cursor: 'pointer', transition: 'all 0.2s',
      }}
    >
      {time}
    </button>
  );
}

// ─── Confirm row ───────────────────────────────────────────────────────────────
function ConfirmRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '12px 0', borderBottom: `1px solid ${T.border}` }}>
      <div>
        <p style={{ fontFamily: T.sans, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: T.dim, margin: '0 0 4px', fontWeight: 600 }}>{label}</p>
        <p style={{ fontFamily: T.serif, fontSize: 15, color: T.text, margin: 0, fontWeight: 400 }}>{value}</p>
      </div>
      <button onClick={onEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.sans, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: T.gold, fontWeight: 600, flexShrink: 0, paddingTop: 2 }}>
        Edit
      </button>
    </div>
  );
}

// ─── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ formData, selectedDate, selectedTime, onClose }: {
  formData: { name: string; email: string; phone: string };
  selectedDate: Date; selectedTime: string;
  onClose: () => void;
}) {
  const buildGoogleUrl = () => {
    const startDate = new Date(`${format(selectedDate, 'yyyy-MM-dd')} ${selectedTime}`);
    const endDate   = new Date(startDate.getTime() + 60 * 60 * 1000);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Meeting+with+FIND+Real+Estate&dates=${format(startDate, "yyyyMMdd'T'HHmmss")}/${format(endDate, "yyyyMMdd'T'HHmmss")}&details=Your+meeting+with+FIND+team`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
    >
      {/* Square check */}
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.15, stiffness: 200 }}
        style={{ width: 56, height: 56, border: `1px solid ${T.goldBorder}`, backgroundColor: T.goldHover, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}
      >
        <Check size={22} style={{ color: T.gold }} />
      </motion.div>

      <h3 style={{ fontFamily: T.serif, fontSize: 24, fontWeight: 700, fontStyle: 'italic', color: T.text, margin: '0 0 12px', letterSpacing: '-0.01em' }}>
        Meeting Confirmed
      </h3>
      <div style={{ height: 1, width: 28, backgroundColor: T.gold, margin: '0 auto 20px' }} />

      <p style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 300, color: T.mid, lineHeight: 1.75, margin: '0 0 6px' }}>
        <strong style={{ color: T.text, fontWeight: 500 }}>{format(selectedDate, 'EEEE, d MMMM yyyy')}</strong> at <strong style={{ color: T.gold, fontWeight: 500 }}>{selectedTime}</strong>
      </p>
      <p style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 300, color: T.dim, margin: '0 0 32px' }}>
        Confirmation sent to {formData.email}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        <a
          href={buildGoogleUrl()} target="_blank" rel="noreferrer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', border: `1px solid ${T.border}`, backgroundColor: T.none, color: T.text, fontFamily: T.sans, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase' as const, fontWeight: 600, textDecoration: 'none', transition: 'all 0.25s' }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = T.goldBorder; e.currentTarget.style.color = T.gold; }}
          onMouseOut={(e)  => { e.currentTarget.style.borderColor = T.border;     e.currentTarget.style.color = T.text; }}
        >
          Add to Google Calendar <ExternalLink size={12} />
        </a>
        <button
          onClick={onClose}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', border: 'none', backgroundColor: T.black, color: '#fafaf8', fontFamily: T.sans, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase' as const, fontWeight: 600, cursor: 'pointer' }}
        >
          Done <ArrowRight size={12} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export function ScheduleMeetingModal() {
  const [step, setStep]               = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess]     = useState(false);
  const [formData, setFormData]       = useState({ name: '', phone: '', email: '', notes: '' });

  const isModalOpen       = useCallStore((s) => s.isScheduleModalOpen);
  const closeScheduleModal = useCallStore((s) => s.closeScheduleModal);
  const scheduledProperty = useCallStore((s) => s.scheduledProperty);
  const markCaptured      = useLeadStore((s) => s.markCaptured);
  const setLead           = useLeadStore((s) => s.setLead);

  useEffect(() => {
    if (scheduledProperty) {
      setFormData((p) => ({ ...p, notes: `I'm interested in: ${scheduledProperty}` }));
    }
  }, [scheduledProperty]);

  const patch = (p: Partial<typeof formData>) => setFormData((prev) => ({ ...prev, ...p }));

  const canProceed = () => {
    if (step === 1) return !!(selectedDate && selectedTime);
    if (step === 2) return !!(formData.name && formData.phone && formData.email);
    return true;
  };

  const handleDateSelect = (date: Date) => {
    if (date.getDay() === 0) return;
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'MEETING_SCHEDULED',
          name: formData.name, phone: formData.phone,
          email: formData.email, notes: formData.notes,
          date: format(selectedDate!, 'EEEE, d MMMM yyyy'),
          time: selectedTime,
          source: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        markCaptured(formData.phone, 'schedule-modal');
        setLead({ name: formData.name, email: formData.email });
        setIsSuccess(true);
      }
    } catch (e) {
      console.error('Schedule error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    closeScheduleModal();
    setTimeout(() => {
      setStep(1); setSelectedDate(null); setSelectedTime(null);
      setFormData({ name: '', phone: '', email: '', notes: '' });
      setIsSuccess(false);
    }, 300);
  };

  if (!isModalOpen) return null;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={handleClose}
          style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10,10,10,0.55)', backdropFilter: 'blur(6px)' }}
        />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.45, ease: EASE }}
          style={{
            position: 'relative', backgroundColor: T.bg,
            width: '100%', maxWidth: 520,
            maxHeight: '92vh', overflowY: 'auto',
            boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
          }}
        >
          {/* Amber top border */}
          <div style={{ height: 2, backgroundColor: T.gold }} />

          {/* ── Header ── */}
          {!isSuccess && (
            <div style={{ padding: '28px 32px 20px', borderBottom: `1px solid ${T.border}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <motion.span
                      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                      style={{ fontFamily: T.sans, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: T.dim, fontWeight: 600 }}
                    >
                      Schedule
                    </motion.span>
                    <motion.div
                      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
                      style={{ height: 1, width: 32, backgroundColor: T.gold, transformOrigin: 'left' }}
                    />
                  </div>
                  <motion.h2
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
                    style={{ fontFamily: T.serif, fontSize: 26, fontWeight: 700, color: T.text, lineHeight: 1.05, letterSpacing: '-0.015em', margin: 0 }}
                  >
                    Book a
                    <em style={{ fontStyle: 'italic', fontWeight: 400, color: T.dim }}> Meeting</em>
                  </motion.h2>
                </div>

                {/* Close */}
                <button
                  onClick={handleClose}
                  style={{ width: 34, height: 34, border: `1px solid ${T.border}`, background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.mid, transition: 'all 0.2s', flexShrink: 0 }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = T.goldBorder; e.currentTarget.style.color = T.gold; }}
                  onMouseOut={(e)  => { e.currentTarget.style.borderColor = T.border;     e.currentTarget.style.color = T.mid; }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Step indicator */}
              <div style={{ display: 'flex', gap: 0 }}>
                {STEP_LABELS.map((label, i) => {
                  const s = i + 1;
                  const active = s <= step;
                  return (
                    <div key={label} style={{ flex: 1, paddingRight: i < 2 ? 8 : 0 }}>
                      <motion.div
                        animate={{ backgroundColor: active ? T.gold : 'rgba(10,10,10,0.10)' }}
                        transition={{ duration: 0.35 }}
                        style={{ height: 2, marginBottom: 6 }}
                      />
                      <p style={{ fontFamily: T.sans, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: active ? T.mid : T.dim, margin: 0, fontWeight: 600 }}>
                        {label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Body ── */}
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <SuccessScreen
                key="success"
                formData={formData}
                selectedDate={selectedDate!}
                selectedTime={selectedTime!}
                onClose={handleClose}
              />
            ) : (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ padding: '28px 32px' }}
              >

                {/* ── Step 1 — Date & Time ── */}
                {step === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div>
                      <FieldLabel>Select a Date</FieldLabel>
                      <div style={{ padding: '20px', border: `1px solid ${T.border}`, backgroundColor: T.surface }}>
                        <CalendarGrid selectedDate={selectedDate} onSelect={handleDateSelect} />
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedDate && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.35, ease: EASE }}
                        >
                          <FieldLabel>Available Time Slots</FieldLabel>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {['Morning', 'Afternoon'].map((period) => (
                              <div key={period}>
                                <p style={{ fontFamily: T.sans, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: T.dim, margin: '0 0 8px', fontWeight: 600 }}>
                                  {period}
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                  {TIME_SLOTS.filter((s) => s.period === period).map((slot) => (
                                    <TimeChip
                                      key={slot.time}
                                      time={slot.time}
                                      selected={selectedTime === slot.time}
                                      onSelect={() => setSelectedTime(slot.time)}
                                    />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* ── Step 2 — Details ── */}
                {step === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <p style={{ fontFamily: T.serif, fontSize: 15, fontStyle: 'italic', color: T.mid, margin: 0 }}>
                      How should we reach you?
                    </p>

                    <div>
                      <FieldLabel>Full Name</FieldLabel>
                      <StyledInput value={formData.name} onChange={(v) => patch({ name: v })} placeholder="Rahul Sharma" />
                    </div>

                    <div>
                      <FieldLabel>Mobile Number</FieldLabel>
                      <p style={{ fontFamily: T.sans, fontSize: 10, color: T.dim, margin: '0 0 8px', letterSpacing: '0.04em' }}>
                        We'll send a reminder before your meeting
                      </p>
                      <div style={{ display: 'flex' }}>
                        <div style={{ padding: '11px 14px', border: `1px solid ${T.border}`, borderRight: 'none', backgroundColor: T.surface, color: T.mid, fontFamily: T.sans, fontSize: 13, fontWeight: 300, flexShrink: 0 }}>
                          +91
                        </div>
                        <div style={{ flex: 1 }}>
                          <StyledInput
                            type="tel" value={formData.phone}
                            onChange={(v) => patch({ phone: v.replace(/\D/g, '').slice(0, 10) })}
                            placeholder="98765 43210"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <FieldLabel>Email Address</FieldLabel>
                      <StyledInput type="email" value={formData.email} onChange={(v) => patch({ email: v })} placeholder="rahul@example.com" />
                    </div>

                    <div>
                      <FieldLabel>Notes (optional)</FieldLabel>
                      <textarea
                        value={formData.notes} rows={3}
                        onChange={(e) => patch({ notes: e.target.value })}
                        placeholder="Properties you're interested in, or questions for us…"
                        style={{ width: '100%', padding: '11px 14px', backgroundColor: T.bg, border: `1px solid ${T.border}`, color: T.text, fontFamily: T.sans, fontSize: 13, fontWeight: 300, outline: 'none', resize: 'none' as const, boxSizing: 'border-box' as const, transition: 'border-color 0.25s', caretColor: T.gold }}
                        onFocus={(e) => { e.target.style.borderColor = T.goldBorder; }}
                        onBlur={(e)  => { e.target.style.borderColor = T.border; }}
                      />
                    </div>
                  </div>
                )}

                {/* ── Step 3 — Confirm ── */}
                {step === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    <p style={{ fontFamily: T.serif, fontSize: 15, fontStyle: 'italic', color: T.mid, margin: '0 0 20px' }}>
                      Please review your booking details
                    </p>
                    <ConfirmRow label="Date & Time" value={`${format(selectedDate!, 'EEEE, d MMMM yyyy')} at ${selectedTime}`} onEdit={() => setStep(1)} />
                    <ConfirmRow label="Full Name"  value={formData.name}                         onEdit={() => setStep(2)} />
                    <ConfirmRow label="Mobile"     value={`+91 ${formData.phone}`}               onEdit={() => setStep(2)} />
                    <ConfirmRow label="Email"      value={formData.email}                        onEdit={() => setStep(2)} />
                    {formData.notes && (
                      <ConfirmRow label="Notes" value={formData.notes} onEdit={() => setStep(2)} />
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Footer actions ── */}
          {!isSuccess && (
            <div style={{ padding: '16px 32px 28px', borderTop: `1px solid ${T.border}`, display: 'flex', gap: 10 }}>
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  style={{ padding: '13px 18px', flexShrink: 0, border: `1px solid ${T.border}`, backgroundColor: T.none, color: T.mid, fontFamily: T.sans, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase' as const, cursor: 'pointer', transition: 'all 0.22s', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = T.borderHov; }}
                  onMouseOut={(e)  => { e.currentTarget.style.borderColor = T.border; }}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 8H1M7 14l-6-6 6-6" />
                  </svg>
                  Back
                </button>
              )}

              <button
                onClick={step === 3 ? handleSubmit : () => canProceed() && setStep(step + 1)}
                disabled={!canProceed() || isSubmitting}
                style={{
                  flex: 1, padding: '13px',
                  backgroundColor: canProceed() && !isSubmitting ? T.black : T.none,
                  border: `1px solid ${canProceed() && !isSubmitting ? T.black : T.border}`,
                  color: canProceed() && !isSubmitting ? '#fafaf8' : T.dim,
                  fontFamily: T.sans, fontSize: 10, letterSpacing: '0.2em',
                  textTransform: 'uppercase' as const, fontWeight: 600,
                  cursor: canProceed() && !isSubmitting ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.25s',
                }}
              >
                {isSubmitting ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', fontSize: 14 }}>◌</motion.span>
                ) : step === 3 ? (
                  <><Check size={14} /> Confirm Booking</>
                ) : (
                  <>Continue <ArrowRight size={13} /></>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}