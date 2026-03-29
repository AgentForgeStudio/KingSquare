'use client';

import { motion } from 'framer-motion';
import { Search, Handshake, Home, Key } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Discover',
    description: 'Share your requirements and preferences with our expert agents. We listen carefully to understand exactly what you need.',
  },
  {
    icon: Handshake,
    number: '02',
    title: 'Connect',
    description: 'We curate exclusive property viewings tailored to your criteria. Our agents guide you through each option with insider knowledge.',
  },
  {
    icon: Home,
    number: '03',
    title: 'Select',
    description: 'Narrow down your choices with professional advice on market trends, investment potential, and lifestyle fit.',
  },
  {
    icon: Key,
    number: '04',
    title: 'Own',
    description: 'Close your deal with confidence. We handle negotiations, legal formalities, and paperwork so you can celebrate your new home.',
  },
];

export function ProcessSection() {
  return (
    <section className="py-32 bg-[#070707] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-900/5 via-[#070707] to-[#070707] z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-gold-400 font-medium tracking-widest uppercase text-xs">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-neutral-50 font-playfair tracking-tight">
            How We Work
          </h2>
          <div className="w-16 h-px bg-gradient-gold mx-auto mb-6"></div>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-light">
            From first consultation to receiving your keys, we make every step seamless and luxurious.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px border-t border-dashed border-gold-500/30" />
              )}

              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full premium-glass mb-8 mx-auto relative group-hover:-translate-y-2 transition-transform duration-500">
                  <step.icon className="w-8 h-8 text-gold-400 relative z-10" />
                </div>
                <span className="text-6xl font-bold text-neutral-800/50 font-playfair absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 -z-10 group-hover:text-gold-900/30 transition-colors">
                  {step.number}
                </span>
                <h3 className="text-xl font-bold text-neutral-50 mb-4 font-playfair tracking-wide">
                  {step.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed font-light">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
