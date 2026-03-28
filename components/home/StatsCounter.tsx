'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: string;
}

const stats: StatItem[] = [
  { value: 2500, suffix: '+', label: 'Luxury Properties', icon: '🏠' },
  { value: 98, suffix: '%', label: 'Client Satisfaction', icon: '⭐' },
  { value: 15, suffix: '+', label: 'Years Experience', icon: '📅' },
  { value: 500, suffix: '+', label: 'Expert Agents', icon: '👥' },
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
    <section className="py-20 bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-mono">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-neutral-400 text-sm tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
