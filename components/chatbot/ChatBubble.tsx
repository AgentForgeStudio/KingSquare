'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import type { ChatMessage } from '@/types/chat';
import { useLeadStore } from '@/store/leadStore';

interface ChatBubbleProps {
  message: ChatMessage;
  onQuickReply?: (action: string) => void;
  onPhoneCapture?: () => void;
  showPhoneCapture?: boolean;
}

const QUICK_REPLIES = [
  { id: 'browse', label: '🏠 Browse Properties' },
  { id: 'neighborhoods', label: '📍 Explore Neighborhoods' },
  { id: 'calculator', label: '💰 Mortgage Calculator' },
  { id: 'agent', label: '📞 Talk to an Agent' },
];

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
        setTimeout(() => {
          onPhoneCapture?.();
        }, 1500);
      }
    } catch (error) {
      console.error('Phone capture error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] ${
          isUser ? 'bg-amber-500' : 'bg-neutral-800'
        } rounded-2xl px-4 py-3`}
      >
        {message.type === 'quick-reply' && !isUser ? (
          <div className="space-y-2">
            <p className="text-white text-sm">{message.content}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply.id}
                  onClick={() => onQuickReply?.(reply.id)}
                  className="px-3 py-2 bg-neutral-700/50 hover:bg-neutral-600 rounded-full text-white text-xs transition-colors"
                >
                  {reply.label}
                </button>
              ))}
            </div>
          </div>
        ) : showPhoneCapture && !isUser && !isSuccess ? (
          <div>
            <p className="text-white text-sm mb-3">{message.content}</p>
            <form onSubmit={handlePhoneSubmit} className="space-y-2">
              <div className="flex gap-1">
                <span className="flex items-center px-2 bg-neutral-700 rounded-lg text-neutral-300 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="number"
                  className="flex-1 px-2 py-1.5 bg-neutral-700 rounded-lg text-white text-sm focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || phone.length < 10}
                className="w-full py-2 bg-green-500 hover:bg-green-600 disabled:bg-neutral-600 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                {isSubmitting ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    Send to WhatsApp ✓
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <p className={`text-sm ${isUser ? 'text-white' : 'text-white'}`}>
            {message.content}
          </p>
        )}
      </div>
    </motion.div>
  );
}
