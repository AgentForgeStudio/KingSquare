'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, PhoneOff, Loader2 } from 'lucide-react';
import { useCallStore } from '@/store/callStore';
import { useVapi } from '@/hooks/useVapi';

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
  red:        '#c85050',
  redBorder:  'rgba(200,80,80,0.30)',
  redHov:     'rgba(200,80,80,0.07)',
  serif:      "'Playfair Display', Georgia, serif",
  sans:       "'DM Sans', sans-serif",
};

// ─── Duration formatter ────────────────────────────────────────────────────────
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ─── Waveform bars ─────────────────────────────────────────────────────────────
function Waveform({ active }: { active: boolean }) {
  const bars = [3, 6, 10, 7, 13, 9, 5, 11, 8, 4, 12, 7, 10, 5, 8, 11, 6, 9, 4, 7];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, height: 32 }}>
      {bars.map((h, i) => (
        <motion.div
          key={i}
          animate={active
            ? { scaleY: [0.15, h / 6, 0.15, h / 10, 0.15] }
            : { scaleY: 0.12 }
          }
          transition={active
            ? { duration: 1.1 + (i % 4) * 0.15, repeat: Infinity, delay: i * 0.055, ease: 'easeInOut' }
            : { duration: 0.5, ease: EASE }
          }
          style={{
            width: 2.5, height: 28, borderRadius: 2,
            backgroundColor: active ? T.gold : 'rgba(10,10,10,0.12)',
            transformOrigin: 'center',
          }}
        />
      ))}
    </div>
  );
}

// ─── Orbital pulse rings + mic centre ─────────────────────────────────────────
function OrbitalRings({ active }: { active: boolean }) {
  return (
    <div style={{ position: 'relative', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {active && [0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: [1, 2.4], opacity: [0.4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute', width: 64, height: 64,
            border: `1px solid ${T.gold}`, borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      ))}
      <motion.div
        animate={active ? { boxShadow: [`0 0 0 0 ${T.gold}40`, `0 0 0 14px ${T.gold}00`] } : {}}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
        style={{
          position: 'relative', zIndex: 1,
          width: 64, height: 64, borderRadius: '50%',
          backgroundColor: active ? T.gold : T.surface,
          border: `1px solid ${active ? T.gold : T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background-color 0.5s, border-color 0.5s',
        }}
      >
        <Mic size={22} style={{ color: active ? '#fafaf8' : T.dim, transition: 'color 0.5s' }} />
      </motion.div>
    </div>
  );
}

// ─── Mute button ───────────────────────────────────────────────────────────────
function MuteButton({ isMuted, disabled, onToggle }: {
  isMuted: boolean; disabled: boolean; onToggle: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button" onClick={onToggle} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '13px 16px',
        border: `1px solid ${isMuted ? T.goldBorder : hov ? T.borderHov : T.border}`,
        backgroundColor: isMuted ? T.goldHover : T.none,
        color: isMuted ? T.gold : hov ? T.text : T.mid,
        fontFamily: T.sans, fontSize: 10, letterSpacing: '0.16em',
        textTransform: 'uppercase' as const, fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1, transition: 'all 0.25s',
      }}
    >
      {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
      {isMuted ? 'Unmute' : 'Mute'}
    </button>
  );
}

// ─── End call button ───────────────────────────────────────────────────────────
function EndCallButton({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button" onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '13px 16px',
        border: `1px solid ${hov ? T.red : T.redBorder}`,
        backgroundColor: hov ? T.redHov : T.none,
        color: T.red, fontFamily: T.sans, fontSize: 10,
        letterSpacing: '0.16em', textTransform: 'uppercase' as const, fontWeight: 600,
        cursor: 'pointer', transition: 'all 0.25s',
      }}
    >
      <PhoneOff size={14} />
      End Call
    </button>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export function LiveCallModal() {
  const isCallActive = useCallStore((s) => s.isCallActive);
  const endStoreCall = useCallStore((s) => s.endCall);

  const startAttemptedRef      = useRef(false);
  const callActuallyStartedRef = useRef(false);
  const userEndedRef           = useRef(false);

  const handleCallStart = useCallback(() => {
    callActuallyStartedRef.current = true;
  }, []);

  const handleCallEnd = useCallback(() => {
    if (userEndedRef.current || callActuallyStartedRef.current) {
      endStoreCall();
    }
  }, [endStoreCall]);

  const handleCallError = useCallback(() => { endStoreCall(); }, [endStoreCall]);

  const { status, isMuted, duration, error, startCall, endCall, toggleMute } = useVapi({
    onCallStart: handleCallStart,
    onCallEnd:   handleCallEnd,
    onError:     handleCallError,
  });

  useEffect(() => {
    if (!isCallActive) {
      startAttemptedRef.current      = false;
      callActuallyStartedRef.current = false;
      userEndedRef.current           = false;
      return;
    }
    if (!startAttemptedRef.current) {
      startAttemptedRef.current = true;
      startCall();
    }
  }, [isCallActive, startCall]);

  const handleEndCall = () => {
    userEndedRef.current = true;
    endCall();
    setTimeout(() => endStoreCall(), 450);
  };

  const isConnecting = status === 'connecting';
  const isActive     = status === 'active';

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      <AnimatePresence>
        {isCallActive && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          >
            {/* Backdrop — no onClick, prevents accidental close */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10,10,10,0.62)', backdropFilter: 'blur(8px)' }}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.95, y: 16  }}
              transition={{ duration: 0.45, ease: EASE }}
              style={{
                position: 'relative', backgroundColor: T.bg,
                width: '100%', maxWidth: 400,
                boxShadow: '0 40px 100px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.10)',
                overflow: 'hidden',
              }}
            >
              {/* Gold accent bar */}
              <div style={{ height: 2, backgroundColor: T.gold }} />

              {/* ── Header ── */}
              <div style={{ padding: '22px 28px 18px', borderBottom: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
                    style={{ fontFamily: T.sans, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: T.dim, fontWeight: 600 }}
                  >
                    Live Call
                  </motion.span>
                  <motion.div
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                    transition={{ duration: 0.55, delay: 0.18, ease: EASE }}
                    style={{ height: 1, width: 28, backgroundColor: T.gold, transformOrigin: 'left' }}
                  />
                  {/* Status badge */}
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <motion.div
                      animate={isActive
                        ? { opacity: [1, 0.25, 1], scale: [1, 0.85, 1] }
                        : { opacity: 1 }
                      }
                      transition={{ duration: 1.4, repeat: Infinity }}
                      style={{
                        width: 6, height: 6, borderRadius: '50%',
                        backgroundColor: isConnecting ? '#f59e0b' : isActive ? '#4ade80' : T.dim,
                      }}
                    />
                    <span style={{ fontFamily: T.sans, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: T.dim, fontWeight: 600 }}>
                      {isConnecting ? 'Connecting' : isActive ? 'Live' : status}
                    </span>
                  </div>
                </div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.2, ease: EASE }}
                  style={{ fontFamily: T.serif, fontSize: 28, fontWeight: 700, color: T.text, lineHeight: 1.0, letterSpacing: '-0.015em', margin: 0 }}
                >
                  KINGSQUARE AI
                  <em style={{ fontStyle: 'italic', fontWeight: 400, color: T.dim }}> Agent</em>
                </motion.h2>
              </div>

              {/* ── Body ── */}
              <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>

                {/* Orbital rings */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.65, delay: 0.28, ease: EASE }}
                >
                  <OrbitalRings active={isActive && !isMuted} />
                </motion.div>

                {/* Waveform */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  style={{ width: '100%' }}
                >
                  <Waveform active={isActive && !isMuted} />
                </motion.div>

                {/* Duration card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.32, ease: EASE }}
                  style={{ width: '100%', padding: '18px 20px', border: `1px solid ${T.border}`, backgroundColor: T.surface, textAlign: 'center' }}
                >
                  <AnimatePresence mode="wait">
                    {isConnecting ? (
                      <motion.div
                        key="connecting"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                      >
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                          <Loader2 size={14} style={{ color: T.gold }} />
                        </motion.div>
                        <p style={{ fontFamily: T.sans, fontSize: 12, color: T.mid, fontWeight: 300, margin: 0 }}>
                          Connecting to voice agent…
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="active"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <p style={{ fontFamily: T.serif, fontSize: 44, fontWeight: 700, color: T.text, lineHeight: 1, margin: '0 0 8px', letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums' }}>
                          {formatDuration(duration)}
                        </p>
                        <div style={{ height: 1, width: 24, backgroundColor: T.gold, margin: '0 auto 8px' }} />
                        <p style={{ fontFamily: T.sans, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: T.dim, margin: 0, fontWeight: 600 }}>
                          {isMuted ? 'Microphone muted' : 'Call in progress'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && (
                    <p style={{ fontFamily: T.sans, fontSize: 11, color: T.red, margin: '10px 0 0', padding: '6px 10px', border: '1px solid rgba(200,80,80,0.2)', backgroundColor: 'rgba(200,80,80,0.05)' }}>
                      {error}
                    </p>
                  )}
                </motion.div>

                {/* Controls */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.4, ease: EASE }}
                  style={{ display: 'flex', gap: 10, width: '100%' }}
                >
                  <MuteButton isMuted={isMuted} disabled={isConnecting} onToggle={toggleMute} />
                  <EndCallButton onClick={handleEndCall} />
                </motion.div>

                {/* Safety hint */}
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  style={{ fontFamily: T.sans, fontSize: 9, letterSpacing: '0.12em', color: T.dim, textAlign: 'center', margin: 0, textTransform: 'uppercase' as const, fontWeight: 500 }}
                >
                  Use the button above to end your call safely
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}