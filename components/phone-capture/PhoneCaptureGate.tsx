'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { useLeadStore } from '@/store/leadStore';

interface PhoneCaptureGateProps {
  onCaptured: () => void;
  onCancel: () => void;
}

export function PhoneCaptureGate({ onCaptured, onCancel }: PhoneCaptureGateProps) {
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const markCaptured = useLeadStore((state) => state.markCaptured);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/phone-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          source: 'call-gate',
          pageUrl: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        markCaptured(phone, 'call-gate');
        onCaptured();
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
      className="bg-neutral-800/80 rounded-xl p-5 border border-neutral-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-semibold">Quick verification</h4>
        <button onClick={onCancel} className="p-1 hover:bg-neutral-700 rounded transition-colors">
          <X className="w-4 h-4 text-neutral-400" />
        </button>
      </div>

      <p className="text-neutral-400 text-sm mb-4">
        We need your number to connect you with an agent. Takes 10 seconds.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 mb-3">
          <div className="flex items-center px-3 bg-neutral-700 rounded-lg text-neutral-300 text-sm">
            +91
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="98765 43210"
            className="flex-1 px-3 py-2.5 bg-neutral-700 rounded-lg text-white text-sm border border-neutral-600 focus:border-amber-500 focus:outline-none transition-colors placeholder:text-neutral-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || phone.length < 10}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Continue to Call
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
