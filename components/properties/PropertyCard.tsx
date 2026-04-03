'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, ArrowRight } from 'lucide-react';
import type { Property } from '@/types/property';
import { formatPrice } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link href={`/properties/${property.slug}`}>
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="relative h-64 overflow-hidden">
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className={`object-cover transition-transform duration-700 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
<div className="absolute inset-0  from-transparent via-white/60 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />            
            <div className="absolute top-4 left-4 flex gap-2">
              {property.featured && (
                <span className="px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                  Featured
                </span>
              )}
              <span
                className={`px-3 py-1 text-white text-xs font-medium rounded-full ${
                  property.status === 'for-sale' ? 'bg-green-500' : 'bg-blue-500'
                }`}
              >
                {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
              </span>
            </div>

            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="px-4 py-2 bg-white text-neutral-900 text-sm font-medium rounded-full flex items-center gap-2">
                View Details
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-amber-500 transition-colors">
                {property.title}
              </h3>
            </div>

            <div className="flex items-center gap-1 text-neutral-500 text-sm mb-4">
              <MapPin className="w-4 h-4" />
              <span>{property.neighborhood}, {property.city}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.beds} Beds</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.baths} Baths</span>
              </div>
              <div className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                <span>{property.sqft.toLocaleString()} sqft</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <p className="text-xl font-bold text-amber-500">
                {formatPrice(property.price)}
              </p>
              <span className="text-sm text-neutral-500 capitalize">{property.type}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
