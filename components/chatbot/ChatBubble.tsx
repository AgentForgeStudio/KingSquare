'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, ArrowRight, CheckCircle } from 'lucide-react';
import type { ChatMessage } from '@/types/chat';
import { useLeadStore } from '@/store/leadStore';

// ─── Easing ────────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ChatBubbleProps {
  message: ChatMessage;
  onQuickReply?: (action: string) => void;
  onPhoneCapture?: () => void;
  showPhoneCapture?: boolean;
}

// ─── Quick replies ─────────────────────────────────────────────────────────────

const QUICK_REPLIES = [
  { id: 'browse',        label: 'Browse Properties' },
  { id: 'neighborhoods', label: 'Explore Neighborhoods' },
  { id: 'calculator',    label: 'Mortgage Calculator' },
  { id: 'agent',         label: 'Talk to an Agent' },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export function ChatBubble({
  message,
  onQuickReply,
  onPhoneCapture,
  showPhoneCapture,
}: ChatBubbleProps) {
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const markCaptured = useLeadStore((state) => state.markCaptured);

  const isUser = message.role === 'user';

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/phone-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          source: 'chatbot',
          pageUrl: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        markCaptured(phone, 'chatbot');
        setIsSuccess(true);
        setTimeout(() => onPhoneCapture?.(), 1500);
      }
    } catch (error) {
      console.error('Phone capture error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* ── AI avatar dot ── */}
      {!isUser && (
        <div className="w-6 h-6 shrink-0 mt-1 mr-2.5 border border-[#c8a96e] flex items-center justify-center">
          <span
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-[8px] font-bold text-[#c8a96e] leading-none"
          >
            AI
          </span>
        </div>
      )}

      <div className={`max-w-[78%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>

        {/* ── Quick reply bubble ── */}
        {message.type === 'quick-reply' && !isUser ? (
          <div className="border border-neutral-200 dark:border-neutral-700 bg-[#fafaf8] dark:bg-neutral-900 px-5 py-4 space-y-4">
            <p
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-200"
            >
              {message.content}
            </p>

            {/* Divider */}
            <div className="h-[1px] bg-neutral-200 dark:bg-neutral-700" />

            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map((reply, i) => (
                <motion.button
                  key={reply.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease: EASE }}
                  onClick={() => onQuickReply?.(reply.id)}
                  className="group flex items-center gap-1.5 px-3.5 py-2 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-[#c8a96e] text-[11px] tracking-[0.1em] uppercase font-medium text-neutral-600 dark:text-neutral-300 hover:text-[#c8a96e] transition-all duration-300"
                >
                  {reply.label}
                  <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>
          </div>

        /* ── Phone capture bubble ── */
        ) : showPhoneCapture && !isUser && !isSuccess ? (
          <div className="border border-neutral-200 dark:border-neutral-700 bg-[#fafaf8] dark:bg-neutral-900 px-5 py-4 space-y-4 w-full">
            <p
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-200"
            >
              {message.content}
            </p>

            <div className="h-[1px] bg-neutral-200 dark:bg-neutral-700" />

            <form onSubmit={handlePhoneSubmit} className="space-y-3">
              {/* Input row */}
              <div className="flex border border-neutral-200 dark:border-neutral-700 overflow-hidden focus-within:border-[#c8a96e] transition-colors duration-300">
                <span className="flex items-center px-3 bg-neutral-100 dark:bg-neutral-800 text-[11px] tracking-[0.1em] text-neutral-500 dark:text-neutral-400 font-medium border-r border-neutral-200 dark:border-neutral-700 shrink-0">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  placeholder="Your mobile number"
                  className="flex-1 px-3 py-2.5 bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || phone.length < 10}
                className="group w-full flex items-center justify-center gap-2.5 py-2.5 bg-neutral-900 dark:bg-white disabled:bg-neutral-200 dark:disabled:bg-neutral-700 text-white dark:text-neutral-900 disabled:text-neutral-400 dark:disabled:text-neutral-500 text-[11px] tracking-[0.16em] uppercase font-semibold transition-all duration-300 hover:bg-[#c8a96e] disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full inline-block"
                  />
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    Send to WhatsApp
                  </>
                )}
              </button>
            </form>
          </div>

        /* ── Success state ── */
        ) : showPhoneCapture && !isUser && isSuccess ? (
          <div className="border border-[#c8a96e]/40 bg-[#fafaf8] dark:bg-neutral-900 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[#c8a96e] flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-[#c8a96e]" />
              </div>
              <div>
                <p
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  className="text-sm font-bold text-neutral-900 dark:text-white leading-tight"
                >
                  Sent successfully.
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 tracking-wide mt-0.5">
                  Check your WhatsApp shortly.
                </p>
              </div>
            </div>
          </div>

        /* ── Standard text bubble ── */
        ) : (
          <div
            className={`px-4 py-3 ${
              isUser
                ? 'bg-[#c8a96e] border border-[#c8a96e]'
                : 'border border-neutral-200 dark:border-neutral-700 bg-[#fafaf8] dark:bg-neutral-900'
            }`}
          >
            <p
              className={`text-sm leading-relaxed ${
                isUser
                  ? 'text-white'
                  : 'text-neutral-700 dark:text-neutral-200'
              }`}
              style={!isUser ? { fontFamily: "'Playfair Display', Georgia, serif" } : undefined}
            >
              {message.content}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}