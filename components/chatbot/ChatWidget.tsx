'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { useCallStore } from '@/store/callStore';
import { ChatInput } from './ChatInput';
import { ChatBubble } from './ChatBubble';
import { TypingIndicator } from './TypingIndicator';
import { EnquiryForm } from './EnquiryForm';

// ── tokens ────────────────────────────────────────────────────
const gold       = '#C9A84C';
const goldDim    = 'rgba(201,168,76,0.10)';
const goldBorder = 'rgba(201,168,76,0.28)';
const bg         = '#0a0a0a';
const surface    = '#111111';
const white      = '#F4F1EB';
const mid        = 'rgba(244,241,235,0.40)';
const dim        = 'rgba(244,241,235,0.18)';
const border     = 'rgba(255,255,255,0.07)';
const serif      = "'Cormorant Garamond','Playfair Display',Georgia,serif";
const sans       = "'Helvetica Neue',Arial,sans-serif";

const QUICK_REPLIES = [
  { id: 'browse',        label: 'Browse Properties',     action: 'browse' },
  { id: 'neighborhoods', label: 'Explore Neighborhoods', action: 'neighborhoods' },
  { id: 'calculator',    label: 'Mortgage Calculator',   action: 'calculator' },
  { id: 'agent',         label: 'Talk to an Agent',      action: 'agent' },
];

// ── Icons ─────────────────────────────────────────────────────
const ChatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ── Tab button ────────────────────────────────────────────────
function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '12px 8px',
        background: 'none', border: 'none',
        fontFamily: sans, fontSize: 10, letterSpacing: '0.18em',
        textTransform: 'uppercase', fontWeight: 700,
        color: active ? gold : mid,
        cursor: 'pointer', position: 'relative',
        transition: 'color 0.25s',
      }}
    >
      {label}
      {active && (
        <motion.div
          layoutId="tab-underline"
          style={{
            position: 'absolute', bottom: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: 28, height: 2, backgroundColor: gold,
          }}
        />
      )}
    </button>
  );
}

// ── Quick reply chip ──────────────────────────────────────────
function QuickReplyChip({ label, onClick }: { label: string; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '7px 13px',
        border: `1px solid ${hov ? goldBorder : border}`,
        backgroundColor: hov ? goldDim : 'transparent',
        color: hov ? gold : mid,
        fontFamily: sans, fontSize: 10, letterSpacing: '0.08em',
        cursor: 'pointer', transition: 'all 0.22s', whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

// ── Main widget ───────────────────────────────────────────────
export function ChatWidget() {
  const [isOpen, setIsOpen]         = useState(false);
  const [showBadge, setShowBadge]   = useState(true);
  const [activeTab, setActiveTab]   = useState<'chat' | 'enquiry'>('chat');
  const messagesEndRef              = useRef<HTMLDivElement>(null);

  const {
    messages, isTyping, addMessage, setTyping,
    messageCount, phoneCapturedInChat,
    markPhoneCapturedInChat, incrementMessageCount,
  } = useChatStore();
  const openCallOptions = useCallStore((s) => s.openCallOptions);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isOpen, messages]);

  // Greeting on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const t1 = setTimeout(() => addMessage({ role: 'assistant', content: "Hello! I'm LUXE AI." }), 500);
      const t2 = setTimeout(() => addMessage({
        role: 'assistant',
        content: 'How can I help you find your dream home?',
        type: 'quick-reply',
      }), 1300);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isOpen, messages.length, addMessage]);

  // Phone capture nudge
  useEffect(() => {
    if (messageCount >= 3 && !phoneCapturedInChat) {
      setTimeout(() => addMessage({
        role: 'assistant',
        content: "Would you like me to send property recommendations to your WhatsApp? Drop your number below 👇",
        type: 'phone-capture-request',
      }), 2000);
    }
  }, [messageCount, phoneCapturedInChat, addMessage]);

  const handleQuickReply = (action: string) => {
    if (action === 'agent') { setIsOpen(false); openCallOptions(); return; }
    const responses: Record<string, string> = {
      browse: 'Great! We have extraordinary listings across Mumbai, Dubai, and New York. Filter by location, price, or type?',
      neighborhoods: 'From Bandra and Juhu in Mumbai to Downtown Dubai and Manhattan — which area interests you?',
      calculator: 'What property price range are you considering? I can walk you through the investment breakdown.',
    };
    addMessage({ role: 'user', content: QUICK_REPLIES.find((q) => q.action === action)?.label || '' });
    incrementMessageCount();
    setTyping(true);
    setTimeout(() => {
      addMessage({ role: 'assistant', content: responses[action] || "I'd be happy to help!" });
      setTyping(false);
    }, 1400);
  };

  const handleSend = async (content: string) => {
    addMessage({ role: 'user', content });
    incrementMessageCount();
    setTyping(true);
    try {
      const res  = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages.map((m) => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      if (data.response) addMessage({ role: 'assistant', content: data.response });
    } catch {
      addMessage({ role: 'assistant', content: 'I apologize, please try again.' });
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      {/* ── Chat panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.92, y: 20  }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              bottom: 'calc(80px + 1rem)',
              right: '1.5rem',
              zIndex: 9999,
              // Responsive width: full on tiny screens, fixed on larger
              width: 'min(420px, calc(100vw - 2rem))',
              height: 'min(600px, calc(100vh - 8rem))',
              backgroundColor: bg,
              border: `1px solid ${border}`,
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: `1px solid ${border}`,
              backgroundColor: surface, flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Avatar */}
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${gold}, #8a6320)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0,
                }}>
                  ✦
                </div>
                <div>
                  <p style={{
                    fontFamily: serif, fontSize: 15, fontWeight: 400,
                    fontStyle: 'italic', color: white, margin: 0, lineHeight: 1.2,
                  }}>
                    LUXE AI Assistant
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: '50%',
                      backgroundColor: '#4ade80',
                      boxShadow: '0 0 5px #4ade80',
                    }} />
                    <p style={{
                      fontFamily: sans, fontSize: 9, letterSpacing: '0.14em',
                      color: dim, margin: 0, textTransform: 'uppercase',
                    }}>
                      Always here
                    </p>
                  </div>
                </div>
              </div>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none', border: `1px solid ${border}`,
                  color: dim, cursor: 'pointer',
                  width: 30, height: 30, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => { (e.currentTarget.style.borderColor = goldBorder); (e.currentTarget.style.color = gold); }}
                onMouseOut={(e)  => { (e.currentTarget.style.borderColor = border); (e.currentTarget.style.color = dim); }}
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex', borderBottom: `1px solid ${border}`,
              backgroundColor: surface, flexShrink: 0,
            }}>
              <Tab label="Chat"    active={activeTab === 'chat'}    onClick={() => setActiveTab('chat')} />
              <Tab label="Enquiry" active={activeTab === 'enquiry'} onClick={() => setActiveTab('enquiry')} />
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              {activeTab === 'chat' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {messages.map((msg) => (
                    <ChatBubble
                      key={msg.id}
                      message={msg}
                      onQuickReply={handleQuickReply}
                      onPhoneCapture={markPhoneCapturedInChat}
                      showPhoneCapture={msg.type === 'phone-capture-request' && !phoneCapturedInChat}
                    />
                  ))}
                  {isTyping && <TypingIndicator />}

                  {/* Quick replies shown under last assistant message if no user reply yet */}
                  {messages.length > 0 && messages[messages.length - 1]?.type === 'quick-reply' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 4 }}>
                      {QUICK_REPLIES.map((q) => (
                        <QuickReplyChip key={q.id} label={q.label} onClick={() => handleQuickReply(q.action)} />
                      ))}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <EnquiryForm />
              )}
            </div>

            {/* Input (chat tab only) */}
            {activeTab === 'chat' && (
              <ChatInput onSend={handleSend} isTyping={isTyping} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB trigger ── */}
      <motion.button
        onClick={() => { setIsOpen((v) => !v); setShowBadge(false); }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed', bottom: '2rem', right: '1.5rem',
          zIndex: 9999,
          width: 60, height: 60, borderRadius: '50%',
          background: `linear-gradient(135deg, ${gold}, #8a6320)`,
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#080808', boxShadow: `0 8px 32px rgba(201,168,76,0.35)`,
        }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <CloseIcon />
            </motion.span>
          ) : (
            <motion.span key="chat"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <ChatIcon />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {!isOpen && (
          <motion.div
            style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: `2px solid ${gold}`,
            }}
            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
          />
        )}

        {/* Unread badge */}
        {showBadge && !isOpen && (
          <div style={{
            position: 'absolute', top: -2, right: -2,
            width: 18, height: 18, borderRadius: '50%',
            backgroundColor: '#e05050',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: sans, fontSize: 10, fontWeight: 700, color: '#fff',
            border: '2px solid #080808',
          }}>
            1
          </div>
        )}
      </motion.button>
    </>
  );
}

export default ChatWidget;