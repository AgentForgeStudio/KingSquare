'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, Bed, Bath, Square } from 'lucide-react';
import { getFeaturedProperties } from '@/data/properties';

// ─── Easing ────────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay, ease: EASE },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, delay, ease: EASE },
  }),
};

const lineGrow = {
  hidden: { scaleX: 0 },
  visible: (delay = 0) => ({
    scaleX: 1,
    transition: { duration: 0.7, delay, ease: EASE },
  }),
};

// ─── Property Card ─────────────────────────────────────────────────────────────

function PropertyCard({
  property,
  index,
}: {
  property: ReturnType<typeof getFeaturedProperties>[number];
  index: number;
}) {
  return (
    <motion.div
      custom={index * 0.12}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={fadeUp}
      className="group relative"
    >
      <Link href={`/properties/${property.slug}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 aspect-[4/3]">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.08]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {property.featured && (
              <span className="px-3 py-1 bg-[#c8a96e] text-white text-[10px] font-semibold tracking-[0.12em] uppercase">
                Featured
              </span>
            )}
            <span
              className={`px-3 py-1 text-white text-[10px] font-semibold tracking-[0.12em] uppercase ${
                property.status === 'for-sale' ? 'bg-emerald-600' : 'bg-blue-600'
              }`}
            >
              {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
            </span>
          </div>

          {/* Hover CTA */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#0a0a0a] text-[11px] font-semibold tracking-[0.1em] uppercase">
              View <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="pt-5 pb-6">
          {/* Accent line */}
          <div className="relative h-[1px] bg-neutral-200 dark:bg-neutral-800 mb-5 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[#c8a96e]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 0.35 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.12 + 0.4, ease: EASE }}
              style={{ transformOrigin: 'left', width: '100%' }}
            />
          </div>

          <h3
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-lg font-bold leading-[1.2] text-neutral-900 dark:text-white group-hover:text-[#c8a96e] transition-colors duration-300 mb-2 tracking-[-0.01em]"
          >
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-[11px] tracking-[0.1em] uppercase mb-4">
            <MapPin className="w-3 h-3 shrink-0" />
            <span>{property.neighborhood}, {property.city}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] tracking-[0.08em] uppercase text-neutral-500 dark:text-neutral-400 mb-5">
            <span className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5" />{property.beds}</span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5" />{property.baths}</span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="flex items-center gap-1.5"><Square className="w-3.5 h-3.5" />{property.sqft.toLocaleString()}</span>
          </div>

          <div className="flex items-end justify-between">
            <p
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-2xl font-bold text-[#c8a96e] leading-none"
            >
              {property.priceLabel}
            </p>
            <span className="text-[10px] tracking-[0.14em] uppercase text-neutral-400 dark:text-neutral-500 capitalize">
              {property.type}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function FeaturedProperties() {
  const featuredProperties = getFeaturedProperties().slice(0, 4);

  return (
    <section className="py-28 md:py-36 bg-[#fafaf8] dark:bg-neutral-950 overflow-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap');`}</style>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="mb-20">
          <div className="flex items-center gap-5 mb-6">
            <motion.span
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeLeft}
              className="text-[11px] tracking-[0.22em] uppercase text-neutral-400 dark:text-neutral-500"
            >
              Curated Selection
            </motion.span>
            <motion.div
              custom={0.1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={lineGrow}
              className="h-[1px] w-16 bg-[#c8a96e] origin-left"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">
            <motion.h2
              custom={0.15}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[0.95] tracking-[-0.025em] text-neutral-900 dark:text-white"
            >
              Featured
              <br />
              <em className="font-normal not-italic text-neutral-400 dark:text-neutral-500">Properties</em>
            </motion.h2>

            <motion.p
              custom={0.28}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-sm text-neutral-500 dark:text-neutral-400 max-w-[240px] leading-relaxed lg:text-right"
            >
              Hand-picked luxury properties from our exclusive portfolio
            </motion.p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {featuredProperties.map((property, i) => (
            <PropertyCard key={property.id} property={property} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          custom={0.5}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-20 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 pt-10"
        >
          <p
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-neutral-400 dark:text-neutral-500 italic text-base hidden sm:block"
          >
            Showing 4 of {getFeaturedProperties().length} curated listings
          </p>
          <Link href="/properties" className="group ml-auto">
            <span className="flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase font-semibold text-neutral-900 dark:text-white">
              View All Properties
              <span className="relative flex items-center justify-center w-10 h-10 border border-neutral-900 dark:border-white overflow-hidden">
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-5 group-hover:opacity-0" />
                <ArrowRight className="w-4 h-4 absolute -translate-x-5 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
            </span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}