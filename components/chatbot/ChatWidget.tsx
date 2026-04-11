'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { useCallStore } from '@/store/callStore';
import { ChatInput } from './ChatInput';
import { ChatBubble } from './ChatBubble';
import { TypingIndicator } from './TypingIndicator';
import { EnquiryForm } from './EnquiryForm';

// ── Design tokens ──────────────────────────────────────────────────────────────
const GOLD        = '#c8a96e';
const GOLD_LIGHT  = 'rgba(200,169,110,0.12)';
const GOLD_BORDER = 'rgba(200,169,110,0.35)';
const BG          = '#0a0a0a';       // panel background
const SURFACE     = '#111111';       // header / tabs
const SURFACE2    = '#161616';       // input area
const BUBBLE_AI   = '#181818';       // assistant bubble bg
const BUBBLE_USER = '#1f1f1f';       // user bubble bg
const BORDER      = 'rgba(255,255,255,0.08)';
const BORDER_MID  = 'rgba(255,255,255,0.12)';
const TEXT_WHITE  = '#f4f1eb';       // primary text
const TEXT_MID    = 'rgba(244,241,235,0.55)';
const TEXT_DIM    = 'rgba(244,241,235,0.28)';

// ── Fonts ──────────────────────────────────────────────────────────────────────
// Cormorant Garamond  →  assistant messages  (high-elegance serif)
// Inter               →  everything else     (crisp, readable sans)
const SERIF = "'Cormorant Garamond', 'Playfair Display', Georgia, serif";
const SANS  = "'Inter', 'Helvetica Neue', Arial, sans-serif";

const EASE: [number,number,number,number] = [0.22, 1, 0.36, 1];

const QUICK_REPLIES = [
  { id: 'browse',        label: 'Browse Properties',     action: 'browse' },
  { id: 'neighborhoods', label: 'Explore Neighborhoods', action: 'neighborhoods' },
  { id: 'calculator',    label: 'Mortgage Calculator',   action: 'calculator' },
  { id: 'agent',         label: 'Talk to an Executive',      action: 'agent' },
];

// ── Icons ──────────────────────────────────────────────────────────────────────
const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

// ── Tab ────────────────────────────────────────────────────────────────────────
function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '14px 8px', background: 'none', border: 'none',
        fontFamily: SANS, fontSize: '10px', letterSpacing: '0.18em',
        textTransform: 'uppercase' as const, fontWeight: 600,
        color: active ? TEXT_WHITE : TEXT_DIM,
        cursor: 'pointer', position: 'relative' as const,
        transition: 'color 0.25s',
      }}
    >
      {label}
      {active && (
        <motion.div
          layoutId="tab-line"
          style={{
            position: 'absolute', bottom: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: 24, height: '2px', backgroundColor: GOLD,
          }}
        />
      )}
    </button>
  );
}

// ── Quick reply chip ───────────────────────────────────────────────────────────
function QuickChip({ label, onClick }: { label: string; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '7px 14px',
        background: hov ? GOLD_LIGHT : 'transparent',
        border: `1px solid ${hov ? GOLD_BORDER : BORDER_MID}`,
        color: hov ? GOLD : TEXT_MID,
        fontFamily: SANS, fontSize: '10px', letterSpacing: '0.08em',
        cursor: 'pointer', transition: 'all 0.22s', whiteSpace: 'nowrap' as const,
        fontWeight: 500,
      }}
    >
      {label}
    </button>
  );
}

// ── Message bubble ─────────────────────────────────────────────────────────────
function Bubble({
  role, content, timestamp,
}: {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      style={{
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: isUser ? 'flex-end' : 'flex-start',
        gap: '5px',
      }}
    >
      {/* Role label */}
      <span style={{
        fontFamily: SANS,
        fontSize: '9px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase' as const,
        color: isUser ? GOLD : TEXT_DIM,
        fontWeight: 600,
        paddingLeft: isUser ? 0 : '2px',
        paddingRight: isUser ? '2px' : 0,
      }}>
        {isUser ? 'You' : 'KINGSQUARE AI'}
      </span>

      {/* Bubble */}
      <div style={{
        maxWidth: '88%',
        padding: '13px 16px',
        background: isUser ? BUBBLE_USER : BUBBLE_AI,
        border: `1px solid ${isUser ? BORDER_MID : BORDER}`,
        position: 'relative' as const,
      }}>
        {/* Gold left accent — assistant only */}
        {!isUser && (
          <div style={{
            position: 'absolute' as const,
            left: 0, top: '10px', bottom: '10px',
            width: '2px',
            background: `linear-gradient(180deg, ${GOLD}, rgba(200,169,110,0.4))`,
          }} />
        )}

        <p style={{
          // Assistant: Cormorant Garamond for editorial luxury feel
          // User: Inter for clean readability
          fontFamily: isUser ? SANS : SERIF,
          fontSize: isUser ? '13px' : '15px',
          fontWeight: isUser ? 400 : 400,
          color: isUser ? TEXT_WHITE : TEXT_WHITE,
          lineHeight: isUser ? 1.65 : 1.75,
          margin: 0,
          paddingLeft: isUser ? 0 : '10px',
          letterSpacing: isUser ? '0.01em' : '0.015em',
        }}>
          {content}
        </p>
      </div>

      {/* Timestamp */}
      {timestamp && (
        <span style={{
          fontFamily: SANS,
          fontSize: '9px',
          color: TEXT_DIM,
          letterSpacing: '0.08em',
          paddingLeft: isUser ? 0 : '2px',
          paddingRight: isUser ? '2px' : 0,
        }}>
          {timestamp}
        </span>
      )}
    </motion.div>
  );
}

// ── Typing dots ────────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-start', gap: '5px' }}>
      <span style={{
        fontFamily: SANS, fontSize: '9px', letterSpacing: '0.18em',
        textTransform: 'uppercase' as const, color: TEXT_DIM, fontWeight: 600, paddingLeft: '2px',
      }}>
        KINGSQUARE AI
      </span>
      <div style={{
        padding: '13px 18px',
        background: BUBBLE_AI,
        border: `1px solid ${BORDER}`,
        position: 'relative' as const,
      }}>
        <div style={{
          position: 'absolute' as const, left: 0, top: '10px', bottom: '10px',
          width: '2px',
          background: `linear-gradient(180deg, ${GOLD}, rgba(200,169,110,0.4))`,
        }} />
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', paddingLeft: '10px' }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.div key={i}
              style={{ width: '5px', height: '5px', background: GOLD, borderRadius: '50%' }}
              animate={{ opacity: [0.25, 1, 0.25], scale: [0.75, 1, 0.75] }}
              transition={{ duration: 1.1, delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Chat input ─────────────────────────────────────────────────────────────────
function Input({ onSend, isTyping }: { onSend: (v: string) => void; isTyping: boolean }) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [btnHov, setBtnHov] = useState(false);
  const canSend = value.trim().length > 0 && !isTyping;

  const submit = () => {
    if (!canSend) return;
    onSend(value);
    setValue('');
  };

  return (
    <div style={{
      borderTop: `1px solid ${BORDER}`,
      background: SURFACE2,
      flexShrink: 0,
      padding: '12px 14px',
      display: 'flex', gap: '10px', alignItems: 'flex-end',
    }}>
      <div style={{
        flex: 1,
        border: `1px solid ${focused ? GOLD_BORDER : BORDER_MID}`,
        background: BG,
        transition: 'border-color 0.25s',
        display: 'flex', alignItems: 'center',
      }}>
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
          placeholder="Type your message…"
          rows={1}
          style={{
            flex: 1, padding: '11px 14px', background: 'transparent',
            border: 'none', outline: 'none', resize: 'none' as const,
            fontFamily: SANS, fontSize: '13px',
            color: TEXT_WHITE,
            lineHeight: 1.5, maxHeight: '80px', overflowY: 'auto' as const,
          }}
        />
      </div>

      <button
        onClick={submit}
        disabled={!canSend}
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        style={{
          width: '42px', height: '42px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: canSend ? (btnHov ? '#fff' : GOLD) : BORDER,
          border: 'none', cursor: canSend ? 'pointer' : 'not-allowed',
          color: canSend ? (btnHov ? '#0a0a0a' : '#0a0a0a') : TEXT_DIM,
          transition: 'background 0.25s, color 0.25s',
        }}
        aria-label="Send"
      >
        <SendIcon />
      </button>
    </div>
  );
}

// ── Main widget ────────────────────────────────────────────────────────────────
export function ChatWidget() {
  const [isOpen, setIsOpen]               = useState(false);
  const [showBadge, setShowBadge]         = useState(true);
  const [showNotif, setShowNotif]         = useState(false);
  const [notifDismissed, setNotifDismissed] = useState(false);
  const [fabShake, setFabShake]           = useState(false);
  const [activeTab, setActiveTab]         = useState<'chat' | 'enquiry'>('chat');
  const [isTypingLocal, setIsTypingLocal] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string; role: 'user' | 'assistant'; content: string; type?: string; ts: string;
  }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const requestIdRef   = useRef(0);

  const { addMessage, setTyping, messageCount, phoneCapturedInChat, markPhoneCapturedInChat, incrementMessageCount } =
    useChatStore();
  const openCallOptions = useCallStore((s) => s.openCallOptions);

  const nowStr = () =>
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const pushMsg = (role: 'user' | 'assistant', content: string, type?: string) => {
    setMessages(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, role, content, type, ts: nowStr() }]);
  };

  // Notification bubble + FAB shake — triggers after 4s idle, repeats shake every 12s
  useEffect(() => {
    if (isOpen || notifDismissed) return;
    const notifT = setTimeout(() => setShowNotif(true), 4000);
    const shakeT = setTimeout(() => setFabShake(true), 3500);
    const shakeOff = setTimeout(() => setFabShake(false), 4200);
    const repeat = setInterval(() => {
      setFabShake(true);
      setTimeout(() => setFabShake(false), 700);
    }, 12000);
    return () => { clearTimeout(notifT); clearTimeout(shakeT); clearTimeout(shakeOff); clearInterval(repeat); };
  }, [isOpen, notifDismissed]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isOpen, messages, isTypingLocal]);

  // Greeting on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const t1 = setTimeout(() => pushMsg('assistant', 'Welcome to KINGSQUARE Real Estate. How may I assist you today?'), 500);
      const t2 = setTimeout(() => pushMsg('assistant', 'I can help you discover properties, explore neighbourhoods, or connect you with a senior agent.', 'quick-reply'), 1400);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isOpen]);

  const handleQuickReply = (action: string) => {
    if (action === 'agent') { setIsOpen(false); openCallOptions?.(); return; }
    const label = QUICK_REPLIES.find(q => q.action === action)?.label || '';
    const responses: Record<string, string> = {
      browse: 'We have curated listings across Naigaon, Virar, and Vasai. Would you like to filter by location, property type, or budget?',
      neighborhoods: 'From Naigaon and Bhabola in Naigaon to Virar West and Vasai — which area interests you most?',
      calculator: 'What property price range are you considering? I can walk you through the full investment breakdown.',
    };
    pushMsg('user', label);
    incrementMessageCount();
    setIsTypingLocal(true);
    setTimeout(() => {
      pushMsg('assistant', responses[action] || "I'd be happy to help. Please share more details.");
      setIsTypingLocal(false);
    }, 1500);
  };

  const handleSend = async (content: string) => {
    const text = content.trim();
    if (!text || isTypingLocal) return;
    pushMsg('user', text);
    incrementMessageCount();
    setIsTypingLocal(true);
    const reqId = ++requestIdRef.current;
    try {
      const res  = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })).concat([{ role: 'user', content: text }]),
        }),
      });
      const data = await res.json();
      if (reqId === requestIdRef.current && data.response) pushMsg('assistant', data.response);
    } catch {
      if (reqId === requestIdRef.current) pushMsg('assistant', 'I apologise — something went wrong. Please try again.');
    } finally {
      if (reqId === requestIdRef.current) setIsTypingLocal(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');
        .find-chat-scroll::-webkit-scrollbar { width: 3px; }
        .find-chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .find-chat-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .find-chat-scroll::-webkit-scrollbar-thumb:hover { background: ${GOLD}; }
        .find-chat-scroll textarea::placeholder { color: rgba(244,241,235,0.22) !important; }
        @keyframes find-pulse  { 0%,100% { transform:scale(1); opacity:.55; } 50% { transform:scale(1.45); opacity:0; } }
        @keyframes find-pulse2 { 0%,100% { transform:scale(1); opacity:.3;  } 50% { transform:scale(1.75); opacity:0; } }
        @keyframes find-shake  { 0%,100%{transform:rotate(0deg)} 15%{transform:rotate(-8deg)} 30%{transform:rotate(8deg)} 45%{transform:rotate(-6deg)} 60%{transform:rotate(6deg)} 75%{transform:rotate(-3deg)} 90%{transform:rotate(3deg)} }
        @keyframes find-notif-in { from{opacity:0;transform:translateY(12px) scale(0.94)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes find-notif-dot { 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }
        .find-shake { animation: find-shake 0.7s cubic-bezier(0.36,0.07,0.19,0.97) both; }
      `}</style>

      {/* ── Chat panel ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.95, y: 16  }}
            transition={{ duration: 0.38, ease: EASE }}
            style={{
              position: 'fixed',
              bottom: 'calc(72px + 20px)',
              right: '24px',
              zIndex: 9999,
              width: 'min(400px, calc(100vw - 2rem))',
              height: 'min(580px, calc(100vh - 8rem))',
              background: BG,
              border: `1px solid ${BORDER}`,
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 32px 96px rgba(0,0,0,0.7), 0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            {/* Gold top rule */}
            <div style={{
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${GOLD} 25%, ${GOLD} 75%, transparent)`,
              flexShrink: 0,
            }} />

            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: `1px solid ${BORDER}`,
              background: SURFACE,
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Avatar */}
                <div style={{
                  width: '38px', height: '38px',
                  border: `1px solid ${GOLD_BORDER}`,
                  background: 'rgba(200,169,110,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>

                <div>
                  {/* Title uses Cormorant for elegance */}
                  <p style={{
                    fontFamily: SERIF, fontSize: '15px', fontWeight: 500,
                    fontStyle: 'italic', color: TEXT_WHITE,
                    margin: 0, lineHeight: 1.2, letterSpacing: '0.01em',
                  }}>
                    KINGSQUARE AI Assistant
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 5px #4ade80' }} />
                    <span style={{ fontFamily: SANS, fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: TEXT_DIM }}>
                      Available now
                    </span>
                  </div>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                style={{
                  width: '30px', height: '30px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'transparent',
                  border: `1px solid ${BORDER}`,
                  cursor: 'pointer', color: TEXT_DIM,
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = GOLD_BORDER; (e.currentTarget as HTMLElement).style.color = GOLD; }}
                onMouseOut={e  => { (e.currentTarget as HTMLElement).style.borderColor = BORDER;      (e.currentTarget as HTMLElement).style.color = TEXT_DIM; }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              borderBottom: `1px solid ${BORDER}`,
              background: SURFACE,
              flexShrink: 0,
            }}>
              <Tab label="Chat"    active={activeTab === 'chat'}    onClick={() => setActiveTab('chat')} />
              <Tab label="Enquiry" active={activeTab === 'enquiry'} onClick={() => setActiveTab('enquiry')} />
            </div>

            {/* Scrollable body */}
            <div
              className="find-chat-scroll"
              style={{ flex: 1, overflowY: 'auto', padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 0 }}
            >
              {activeTab === 'chat' ? (
                <>
                  {/* Date stamp */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ flex: 1, height: '1px', background: BORDER }} />
                    <span style={{ fontFamily: SANS, fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: TEXT_DIM }}>
                      {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
                    </span>
                    <div style={{ flex: 1, height: '1px', background: BORDER }} />
                  </div>

                  {/* Messages */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {messages.map((msg) => (
                      <div key={msg.id}>
                        <Bubble role={msg.role} content={msg.content} timestamp={msg.ts} />
                      </div>
                    ))}

                    {/* Quick reply chips */}
                    {messages.length > 0 && messages[messages.length - 1]?.type === 'quick-reply' && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.35, ease: EASE }}
                        style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingLeft: '2px', marginTop: '4px' }}
                      >
                        {QUICK_REPLIES.map(q => (
                          <QuickChip key={q.id} label={q.label} onClick={() => handleQuickReply(q.action)} />
                        ))}
                      </motion.div>
                    )}

                    {/* Typing indicator */}
                    {isTypingLocal && <TypingDots />}
                  </div>

                  <div ref={messagesEndRef} />
                </>
              ) : (
                <EnquiryForm />
              )}
            </div>

            {/* Input */}
            {activeTab === 'chat' && (
              <Input onSend={handleSend} isTyping={isTypingLocal} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB ─────────────────────────────────────────────────────────────── */}
      <motion.button
        onClick={() => { setIsOpen(v => !v); setShowBadge(false); }}
        whileHover={{ scale: 1.08, boxShadow: `0 12px 40px rgba(200,169,110,0.55), 0 4px 16px rgba(0,0,0,0.4)` }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open chat"
        style={{
          position: 'fixed', bottom: '28px', right: '28px', zIndex: 9999,
          width: '60px', height: '60px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, #d4b06a 0%, ${GOLD} 45%, #a8843c 100%)`,
          border: 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#1a1200',
          boxShadow: `0 8px 32px rgba(200,169,110,0.40), 0 2px 8px rgba(0,0,0,0.35)`,
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <CloseIcon />
            </motion.span>
          ) : (
            <motion.span key="c" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <ChatIcon />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse ring — circular */}
        {!isOpen && (
          <div style={{
            position: 'absolute', inset: '-6px',
            borderRadius: '50%',
            border: `1.5px solid rgba(200,169,110,0.55)`,
            animation: 'find-pulse 2.4s ease-out infinite',
            pointerEvents: 'none',
          }} />
        )}

        {/* Badge */}
        {showBadge && !isOpen && (
          <div style={{
            position: 'absolute', top: '-2px', right: '-2px',
            width: '18px', height: '18px',
            background: '#e05050', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: SANS, fontSize: '9px', fontWeight: 700, color: '#fff',
            border: '2px solid #fff',
            boxShadow: '0 2px 8px rgba(224,80,80,0.5)',
          }}>
            1
          </div>
        )}
      </motion.button>
    </>
  );
}

export default ChatWidget;