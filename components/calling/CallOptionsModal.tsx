'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Calendar, Mail } from 'lucide-react';
import { useCallStore } from '@/store/callStore';
import { useLeadStore } from '@/store/leadStore';
import { PhoneCaptureGate } from '../phone-capture/PhoneCaptureGate';

export function CallOptionsModal() {
  const [showPhoneGate, setShowPhoneGate] = useState(false);
  const isModalOpen = useCallStore((state) => state.isModalOpen);
  const closeCallOptions = useCallStore((state) => state.closeCallOptions);
  const openScheduleModal = useCallStore((state) => state.openScheduleModal);
  const startCall = useCallStore((state) => state.startCall);
  const hasPhoneCaptured = useLeadStore((state) => state.phoneCapture);

  const handleStartCall = () => {
    if (hasPhoneCaptured) {
      startCall();
    } else {
      setShowPhoneGate(true);
    }
  };

  const handlePhoneCaptured = () => {
    setShowPhoneGate(false);
    startCall();
  };

  const handleScheduleClick = () => {
    closeCallOptions();
    openScheduleModal();
  };

  const handleEmailClick = () => {
    closeCallOptions();
    window.location.href = '/contact#email';
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeCallOptions} />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-neutral-900/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-2xl border border-neutral-800 overflow-hidden"
          >
            <button
              onClick={closeCallOptions}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>

            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Connect With Our Team</h2>
              <p className="text-neutral-400 mb-8">How would you like to reach us?</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {showPhoneGate ? (
                  <div className="md:col-span-2">
                    <PhoneCaptureGate
                      onCaptured={handlePhoneCaptured}
                      onCancel={() => setShowPhoneGate(false)}
                    />
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleStartCall}
                      className="group relative p-6 bg-neutral-800/50 rounded-2xl border-2 border-neutral-700 hover:border-amber-500 transition-all duration-300 text-left"
                    >
                      <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition-colors">
                        <Mic className="w-8 h-8 text-amber-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Talk to Agent Now</h3>
                      <p className="text-neutral-400 text-sm mb-4">
                        Instant AI voice call. Available 24/7
                      </p>
                      <span className="inline-flex items-center gap-1 text-amber-500 font-medium group-hover:gap-2 transition-all">
                        Start Call
                        <span className="text-lg">→</span>
                      </span>
                    </button>

                    <button
                      onClick={handleScheduleClick}
                      className="group relative p-6 bg-neutral-800/50 rounded-2xl border-2 border-neutral-700 hover:border-cyan-500 transition-all duration-300 text-left"
                    >
                      <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                        <Calendar className="w-8 h-8 text-cyan-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Schedule a Meeting</h3>
                      <p className="text-neutral-400 text-sm mb-4">
                        Pick a time that suits you. We'll confirm.
                      </p>
                      <span className="inline-flex items-center gap-1 text-cyan-500 font-medium group-hover:gap-2 transition-all">
                        Pick a Time
                        <span className="text-lg">→</span>
                      </span>
                    </button>
                  </>
                )}
              </div>

              {!showPhoneGate && (
                <button
                  onClick={handleEmailClick}
                  className="inline-flex items-center gap-2 text-neutral-500 hover:text-white text-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Prefer email? Send us a message
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
