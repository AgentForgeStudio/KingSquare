'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { useCallStore } from '@/store/callStore';
import { DirectEmailForm } from '@/components/chatbot/DirectEmailForm';

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const openCallOptions = useCallStore((state) => state.openCallOptions);
  const openScheduleModal = useCallStore(
    (state) => state.openScheduleModal
  );

  return (
    <div className="min-h-screen bg-[#f8f7f4] pt-24">

      {/* PREMIUM BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,169,110,0.15),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-serif tracking-wide text-neutral-900 mb-6">
            Let’s Begin Your <span className="text-[#c8a96e]">Journey</span>
          </h1>

          <p className="text-neutral-500 max-w-xl mx-auto text-lg">
            A few details and we’ll match you with your perfect property.
          </p>
        </motion.div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT — FORM EXPERIENCE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-neutral-200"
          >
            {/* STEP INDICATOR */}
            <div className="mb-8">
              <p className="text-xs tracking-[0.3em] text-neutral-400 uppercase mb-2">
                Step 1 of 1
              </p>

              <div className="h-[2px] bg-neutral-200 relative">
                <div className="absolute left-0 top-0 h-full w-full bg-[#c8a96e]" />
              </div>
            </div>

            <h2 className="text-2xl font-serif text-neutral-900 mb-6">
              Tell Us About You
            </h2>

            {/* FORM */}
            <div className="space-y-6">
              <DirectEmailForm />
            </div>

            {/* TRUST */}
            <p className="text-xs text-neutral-400 mt-6">
              ✦ No spam. Only premium property insights.
            </p>
          </motion.div>

          {/* RIGHT — INTERACTIVE CONTACT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >

            {/* CONTACT CARD */}
            <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-neutral-200 space-y-6">

              <h3 className="text-xl font-serif text-neutral-900">
                Prefer Direct Contact?
              </h3>

              {[
                { icon: Phone, label: '+91 98765 43210' },
                { icon: Mail, label: 'hello@kingsquare.com' },
                { icon: MapPin, label: 'Naigaon • Virar • Global' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-[#c8a96e]/10 flex items-center justify-center group-hover:scale-110 transition">
                    <item.icon className="w-5 h-5 text-[#c8a96e]" />
                  </div>
                  <p className="text-neutral-700">{item.label}</p>
                </div>
              ))}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">

                 <button onClick={() => openCallOptions()}
                  className="flex-1 py-3 rounded-xl bg-[#c8a96e] text-white hover:scale-[1.02] transition-all shadow-md"
                >
                  Call Now
                </button>
              <button onClick={() => openScheduleModal()}
                  className="flex-1 py-3 rounded-xl border border-neutral-300 hover:border-[#c8a96e] transition-all"
                >
                  Book Meeting
                </button>
              </div>
            </div>

            {/* VISUAL CARD */}
            <div className="rounded-[2rem] overflow-hidden h-64 bg-gradient-to-br from-neutral-200 to-neutral-100 flex items-center justify-center">
              <p className="text-neutral-400 italic">
                Your dream property awaits…
              </p>
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-24">

          <h2 className="text-3xl font-serif text-center mb-10 text-neutral-900">
            Questions?
          </h2>

          <div className="space-y-4">
            {[
              'What areas do you serve?',
              'How fast will I get response?',
              'Do you work internationally?',
            ].map((q, i) => (
              <div key={i} className="bg-white rounded-xl border border-neutral-200">

                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex justify-between items-center"
                >
                  <span className="text-neutral-800">{q}</span>
                  <ChevronDown
                    className={`transition ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-6 pb-4 text-neutral-500"
                  >
                    We provide premium real estate services tailored to you.
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}