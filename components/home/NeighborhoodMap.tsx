'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

const neighborhoods = [
  { name: 'Beverly Hills', city: 'Los Angeles', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2674&auto=format&fit=crop', count: 124 },
  { name: 'Bel Air', city: 'Los Angeles', image: 'https://images.unsplash.com/photo-1613490908681-3e4b7b2fb0eb?q=80&w=2653&auto=format&fit=crop', count: 87 },
  { name: 'Hollywood Hills', city: 'Los Angeles', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop', count: 63 },
  { name: 'Downtown', city: 'Dubai', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2574&auto=format&fit=crop', count: 156 },
  { name: 'Upper East Side', city: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2670&auto=format&fit=crop', count: 92 },
  { name: 'Palm Jumeirah', city: 'Dubai', image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2669&auto=format&fit=crop', count: 78 },
];

export function NeighborhoodMap() {
  return (
    <section className="py-32 bg-[#0a0a0a] relative border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-gold-400 font-medium tracking-widest uppercase text-xs">
            Prime Locations
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-neutral-50 font-playfair tracking-tight">
            Explore Neighborhoods
          </h2>
          <div className="w-16 h-px bg-gradient-gold mx-auto mb-6"></div>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-light">
            Discover luxury living in the world&apos;s most desirable addresses.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {neighborhoods.map((area, i) => (
            <motion.div
              key={area.name}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative h-80 rounded-xl overflow-hidden cursor-pointer border border-neutral-800/50"
            >
              <Image
                src={area.image}
                alt={area.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/40 to-transparent" />
              <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/10 transition-colors duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-1.5 text-gold-400 text-xs mb-3 font-bold tracking-widest uppercase">
                  <MapPin className="w-3 h-3" />
                  <span>{area.city}</span>
                </div>
                <h3 className="text-neutral-50 font-playfair font-bold text-2xl mb-2">{area.name}</h3>
                <p className="text-neutral-400 text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{area.count} exclusive properties</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
