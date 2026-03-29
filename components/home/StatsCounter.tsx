'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Star, Calendar, Users } from 'lucide-react';

const stats = [
  { value: 2500, suffix: '+', label: 'Luxury Properties', icon: Home },
  { value: 98, suffix: '%', label: 'Client Satisfaction', icon: Star },
  { value: 15, suffix: '+', label: 'Years Experience', icon: Calendar },
  { value: 500, suffix: '+', label: 'Expert Agents', icon: Users },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export function StatsCounter() {
  return (
    <section className="py-24 bg-[#0a0a0a] text-neutral-50 relative z-10 border-t border-neutral-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/10 mb-6 group-hover:bg-gold-500/20 transition-colors">
                <stat.icon className="w-8 h-8 text-gold-400" />
              </div>
              <div className="text-4xl md:text-6xl font-bold mb-2 font-playfair text-neutral-50">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-gold-200/60 text-xs tracking-widest uppercase font-bold mt-3">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
