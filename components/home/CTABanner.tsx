'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, ArrowRight } from 'lucide-react';
import { useCallStore } from '@/store/callStore';
import Link from 'next/link';

export function CTABanner() {
  const openCallOptions = useCallStore((s) => s.openCallOptions);
  const openScheduleModal = useCallStore((s) => s.openScheduleModal);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.07'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber-400 font-medium tracking-wider uppercase text-sm">
            Start Your Journey
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6 font-serif tracking-tight">
            Find Your Dream Property Today
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto mb-10">
            Connect with our expert agents and discover extraordinary properties that match your lifestyle. 
            Personalized service, global reach, unmatched expertise.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openCallOptions()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-semibold transition-colors text-base"
            >
              <Phone className="w-5 h-5" />
              Talk to Agent
            </button>
            <button
              onClick={() => openScheduleModal()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-neutral-600 hover:border-amber-500 text-white rounded-full font-semibold transition-colors text-base"
            >
              <Mail className="w-5 h-5" />
              Schedule Meeting
            </button>
          </div>

          <div className="mt-8">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-amber-400 transition-colors text-sm"
            >
              Browse Properties <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
