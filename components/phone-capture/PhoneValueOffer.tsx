'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { useLeadStore } from '@/store/leadStore';

export function PhoneValueOffer() {
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
          source: 'inline-value-strip',
          pageUrl: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        markCaptured(phone, 'inline-value-strip');
        setIsSuccess(true);
      }
    } catch (error) {
      console.error('Phone capture error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-neutral-950 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 text-white"
          >
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span className="text-lg font-medium">You're on the list! We'll be in touch.</span>
          </motion.div>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📲</span>
              <div>
                <p className="text-white font-semibold text-lg">
                  Get exclusive listings before they go public
                </p>
                <p className="text-neutral-400 text-sm">
                  Join 2,400+ buyers already getting early alerts
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden">
                <span className="px-3 py-2.5 text-neutral-300 text-sm bg-neutral-800 border-r border-neutral-700">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Mobile number"
                  className="w-40 md:w-48 px-3 py-2.5 bg-neutral-800 text-white text-sm focus:outline-none placeholder:text-neutral-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || phone.length < 10}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <>
                    Get Early Access
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
