'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string) => void;
  isTyping: boolean;
}

const gold       = '#C9A84C';
const goldBorder = 'rgba(201,168,76,0.4)';
const sans       = "'Helvetica Neue', Arial, sans-serif";

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

export function ChatInput({ onSend, isTyping }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [focused, setFocused]  = useState(false);
  const [hovered, setHovered]  = useState(false);
  const canSend = message.trim().length > 0 && !isTyping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSend) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        backgroundColor: '#0a0a0a',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Input */}
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={isTyping ? 'Agent is typing…' : 'Type your message…'}
            disabled={isTyping}
            style={{
              width: '100%',
              padding: '11px 16px',
              backgroundColor: '#141414',
              border: `1px solid ${focused ? goldBorder : 'rgba(255,255,255,0.08)'}`,
              color: '#F4F1EB',
              fontFamily: sans,
              fontSize: 13,
              letterSpacing: '0.02em',
              outline: 'none',
              transition: 'border-color 0.25s ease',
              opacity: isTyping ? 0.5 : 1,
              boxSizing: 'border-box',
            }}
          />
          {/* Gold focus underline */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0,
            height: 1,
            background: gold,
            width: focused ? '100%' : '0%',
            transition: 'width 0.35s ease',
          }} />
        </div>

        {/* Send button */}
        <motion.button
          type="submit"
          disabled={!canSend}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileTap={{ scale: 0.94 }}
          style={{
            width: 44, height: 44, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: canSend ? (hovered ? '#a8821e' : gold) : '#1c1c1c',
            border: `1px solid ${canSend ? gold : 'rgba(255,255,255,0.07)'}`,
            color: canSend ? '#080808' : 'rgba(255,255,255,0.2)',
            cursor: canSend ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease',
          }}
          aria-label="Send message"
        >
          <SendIcon />
        </motion.button>
      </div>

      {/* Hint text */}
      <p style={{
        fontFamily: sans, fontSize: 9, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: 'rgba(244,241,235,0.2)',
        margin: '8px 0 0', textAlign: 'center',
      }}>
        Press Enter to send
      </p>
    </form>
  );
}

export default ChatInput;