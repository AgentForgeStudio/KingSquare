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
    <section className="py-24 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-amber-500 font-medium tracking-wider uppercase text-sm">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-5 text-neutral-900 dark:text-white font-serif tracking-tight">
            How We Work
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
            From first consultation to receiving your keys, we make every step seamless
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-amber-500/30 to-transparent" />
              )}
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-50 dark:bg-amber-500/10 mb-6 mx-auto">
                  <step.icon className="w-8 h-8 text-amber-500" />
                </div>
                <span className="text-5xl font-bold text-neutral-100 dark:text-neutral-800 font-mono absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
                  {step.number}
                </span>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
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
