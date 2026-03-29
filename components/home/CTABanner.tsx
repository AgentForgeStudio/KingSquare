'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, ArrowRight } from 'lucide-react';
import { useCallStore } from '@/store/callStore';
import Link from 'next/link';

export function CTABanner() {
  const openCallOptions = useCallStore((s) => s.openCallOptions);
  const openScheduleModal = useCallStore((s) => s.openScheduleModal);

  return (
    <section className="relative py-32 overflow-hidden border-t border-neutral-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#0a0a0a] z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gold-900/10 via-[#0a0a0a] to-[#0a0a0a] z-10"></div>
        <div className="absolute inset-0 opacity-[0.03] z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="premium-glass p-12 md:p-20 rounded-3xl"
        >
          <span className="text-gold-400 font-medium tracking-widest uppercase text-xs">
            Start Your Journey
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-neutral-50 mt-4 mb-6 font-playfair tracking-tight">
            Find Your Dream <br className="hidden md:block" />
            <span className="text-gradient-gold italic">Property Today</span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto mb-10 font-light">
            Connect with our expert agents and discover extraordinary properties that match your lifestyle.
            Personalized service, global reach, unmatched expertise.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => openCallOptions()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-gold text-[#0a0a0a] rounded-full font-bold uppercase tracking-wider transition-all hover-lift hover:opacity-90 text-sm"
            >
              <Phone className="w-4 h-4" />
              Talk to Agent
            </button>
            <button
              onClick={() => openScheduleModal()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-gold-500/30 hover:border-gold-500 hover:bg-gold-500/10 text-gold-400 rounded-full font-bold uppercase tracking-wider transition-all hover-lift text-sm"
            >
              <Mail className="w-4 h-4" />
              Schedule Meeting
            </button>
          </div>

          <div className="mt-12">
            <Link
              href="#properties"
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-gold-400 transition-colors uppercase tracking-widest font-bold text-xs"
            >
              Browse Properties <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
