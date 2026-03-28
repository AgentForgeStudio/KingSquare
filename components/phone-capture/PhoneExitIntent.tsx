'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, Gift } from 'lucide-react';
import { useLeadStore } from '@/store/leadStore';
import { useExitIntent } from '@/hooks/useExitIntent';

interface PhoneExitIntentProps {
  onShowChange?: (show: boolean) => void;
}

export function PhoneExitIntent({ onShowChange }: PhoneExitIntentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const markCaptured = useLeadStore((state) => state.markCaptured);

  const handleShowExitIntent = () => {
    setIsVisible(true);
    onShowChange?.(true);
  };

  useExitIntent({
    enabled: !isVisible,
    onExitIntent: handleShowExitIntent,
  });

  useEffect(() => {
    onShowChange?.(isVisible);
  }, [isVisible, onShowChange]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('luxe_exit_shown', 'true');
    onShowChange?.(false);
  };

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
          source: 'exit-intent',
          pageUrl: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        markCaptured(phone, 'exit-intent');
        setIsSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 2500);
      }
    } catch (error) {
      console.error('Phone capture error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/70" onClick={handleClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg border border-neutral-800 overflow-hidden"
          >
            {!isSuccess ? (
              <>
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-neutral-400" />
                </button>

                <div className="p-8 text-center">
                  <p className="text-neutral-400 text-sm mb-2">Wait — before you go...</p>

                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Gift className="w-8 h-8 text-amber-500" />
                    <h2 className="text-2xl font-bold text-white">Get a FREE Property Report</h2>
                  </div>

                  <p className="text-neutral-400 mb-6 max-w-sm mx-auto">
                    Enter your number and we'll send you a personalised report on the best luxury properties in your budget — straight to WhatsApp. Takes 2 minutes.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2">
                      <div className="flex items-center px-4 py-3 bg-neutral-800 rounded-lg text-neutral-300 text-sm border border-neutral-700">
                        +91
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Your mobile number"
                        className="flex-1 px-4 py-3 bg-neutral-800 rounded-lg text-white text-sm border border-neutral-700 focus:border-amber-500 focus:outline-none transition-colors placeholder:text-neutral-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || phone.length < 10}
                      className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send My Free Report
                        </>
                      )}
                    </button>
                  </form>

                  <button
                    onClick={handleClose}
                    className="mt-4 text-neutral-500 hover:text-neutral-300 text-xs transition-colors"
                  >
                    No, I don't want free reports
                  </button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-white text-lg font-medium">Report on its way to your WhatsApp!</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
