'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface PhoneValueOfferProps {
  onDismiss?: () => void;
}

export function PhoneValueOffer({ onDismiss }: PhoneValueOfferProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-r from-amber-500 to-amber-600 text-white py-6 px-8"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest opacity-80 mb-1">Exclusive Offer</p>
          <p className="text-lg md:text-xl font-bold">
            Get a free property valuation &mdash; Call our agents now
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="tel:+919876543210"
            className="px-6 py-2.5 bg-white text-amber-600 font-semibold rounded-full hover:bg-neutral-100 transition-colors text-sm"
          >
            Call +91 98765 43210
          </a>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1.5 hover:bg-amber-400 rounded-full transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
