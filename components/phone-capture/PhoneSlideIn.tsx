'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle } from 'lucide-react';
import { useLeadStore } from '@/store/leadStore';
import { usePhoneCapture } from '@/hooks/usePhoneCapture';

export function PhoneSlideIn() {
  const [isVisible, setIsVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const markCaptured = useLeadStore((state) => state.markCaptured);
  const { shouldShowSlideIn, dismissSlideIn } = usePhoneCapture();

  useEffect(() => {
    const handleShow = () => {
      if (shouldShowSlideIn()) {
        setIsVisible(true);
      }
    };

    window.addEventListener('showPhoneSlideIn', handleShow);
    handleShow();

    return () => {
      window.removeEventListener('showPhoneSlideIn', handleShow);
    };
  }, [shouldShowSlideIn]);

  const handleClose = () => {
    setIsVisible(false);
    dismissSlideIn();
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
          source: 'slide-in-45s',
          pageUrl: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        markCaptured(phone, 'slide-in-45s');
        setIsSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 3000);
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
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-24 right-4 md:right-8 z-50 w-[320px] max-w-[calc(100vw-2rem)]"
        >
          <div className="bg-neutral-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-800 overflow-hidden">
            {!isSuccess ? (
              <>
                <div className="relative p-5">
                  <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-neutral-400" />
                  </button>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🏠</span>
                    <h3 className="text-white font-semibold">Get Matched to Your Dream Home</h3>
                  </div>

                  <p className="text-neutral-400 text-sm mb-4">
                    We'll WhatsApp you new listings the moment they hit the market.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="flex gap-2 mb-3">
                      <div className="flex items-center px-3 py-2.5 bg-neutral-800 rounded-lg text-neutral-300 text-sm border border-neutral-700">
                        +91
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="98765 43210"
                        className="flex-1 px-3 py-2.5 bg-neutral-800 rounded-lg text-white text-sm border border-neutral-700 focus:border-amber-500 focus:outline-none transition-colors placeholder:text-neutral-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || phone.length < 10}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Me Properties
                        </>
                      )}
                    </button>
                  </form>

                  <p className="text-neutral-500 text-xs text-center mt-3">
                    No spam. Unsubscribe anytime.
                  </p>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 text-center"
              >
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-white font-medium">Perfect! Watch your WhatsApp for new listings 🏠</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
