'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

const neighborhoods = [
  { name: 'Bandra West', city: 'Mumbai', image: '/cloud.jpeg', count: 124 },
  { name: 'Juhu', city: 'Mumbai', image: '/cloud.jpeg', count: 87 },
  { name: 'Powai', city: 'Mumbai', image: '/cloud.jpeg', count: 63 },
  { name: 'Downtown', city: 'Dubai', image: '/cloud.jpeg', count: 156 },
  { name: 'Upper East Side', city: 'New York', image: '/cloud.jpeg', count: 92 },
  { name: 'Emirates Hills', city: 'Dubai', image: '/cloud.jpeg', count: 78 },
];

export function NeighborhoodMap() {
  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-amber-500 font-medium tracking-wider uppercase text-sm">
            Prime Locations
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-5 text-neutral-900 dark:text-white font-serif tracking-tight">
            Explore Neighborhoods
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
            Discover luxury living in the world&apos;s most desirable addresses
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {neighborhoods.map((area, i) => (
            <motion.div
              key={area.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative h-48 md:h-64 rounded-2xl overflow-hidden cursor-pointer"
            >
              <Image
                src={area.image}
                alt={area.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors duration-300" />
              
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-1.5 text-white/80 text-xs mb-1">
                  <MapPin className="w-3 h-3" />
                  <span>{area.city}</span>
                </div>
                <h3 className="text-white font-bold text-lg">{area.name}</h3>
                <p className="text-white/60 text-sm">{area.count} properties</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
