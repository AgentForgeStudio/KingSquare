'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, Bed, Bath, Square } from 'lucide-react';
import { getFeaturedProperties } from '@/data/properties';
import { formatPrice } from '@/lib/utils';

export function FeaturedProperties() {
  const featuredProperties = getFeaturedProperties().slice(0, 4);

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
            Curated Selection
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-5 text-neutral-900 dark:text-white font-serif tracking-tight">
            Featured Properties
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
            Hand-picked luxury properties from our exclusive portfolio
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <Link href={`/properties/${property.slug}`}>
                <div className="relative overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-900 shadow-md hover:shadow-2xl transition-all duration-300">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className={`object-cover transition-transform duration-700 ${
                        'group-hover:scale-110'
                      }`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex gap-2">
                      {property.featured && (
                        <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
                          Featured
                        </span>
                      )}
                      <span className={`px-2.5 py-1 text-white text-xs font-semibold rounded-full ${
                        property.status === 'for-sale' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}>
                        {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-3 py-1.5 bg-white/95 text-neutral-900 text-xs font-semibold rounded-full flex items-center gap-1.5">
                        View <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white group-hover:text-amber-500 transition-colors mb-1.5">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1 text-neutral-500 text-xs mb-3">
                      <MapPin className="w-3 h-3" />
                      <span>{property.neighborhood}, {property.city}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                      <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{property.beds}</span>
                      <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{property.baths}</span>
                      <span className="flex items-center gap-1"><Square className="w-3 h-3" />{property.sqft.toLocaleString()}</span>
                    </div>

                    <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                      <p className="text-lg font-bold text-amber-500">{property.priceLabel}</p>
                      <span className="text-xs text-neutral-400 capitalize">{property.type}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/properties">
            <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-medium hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors">
              View All Properties
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
