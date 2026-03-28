'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, Map, ChevronDown } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';
import { PropertyCard } from './PropertyCard';
import { properties } from '@/data/properties';
import type { PropertyType, PropertyStatus } from '@/types/property';

const PROPERTY_TYPES: { value: PropertyType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'estate', label: 'Estate' },
  { value: 'townhouse', label: 'Townhouse' },
];

const STATUS_OPTIONS: { value: PropertyStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'for-sale', label: 'For Sale' },
  { value: 'for-rent', label: 'For Rent' },
];

export function PropertyGrid() {
  const [showFilters, setShowFilters] = useState(false);
  const { filters, sortBy, viewMode, setFilter, setSortBy, setViewMode, resetFilters } =
    useFilterStore();

  const filteredProperties = properties.filter((property) => {
    if (filters.type !== 'all' && property.type !== filters.type) return false;
    if (filters.status !== 'all' && property.status !== filters.status) return false;
    if (property.price < filters.priceMin || property.price > filters.priceMax) return false;
    if (property.beds < filters.bedsMin) return false;
    if (property.baths < filters.bathsMin) return false;
    return true;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'newest':
        return b.yearBuilt - a.yearBuilt;
      case 'sqft':
        return b.sqft - a.sqft;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-amber-500 hover:text-amber-600"
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Status</label>
                    <div className="flex gap-2">
                      {STATUS_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setFilter('status', option.value)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            filters.status === option.value
                              ? 'bg-amber-500 text-white'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Property Type</label>
                    <div className="space-y-2">
                      {PROPERTY_TYPES.map((type) => (
                        <label
                          key={type.value}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="propertyType"
                            checked={filters.type === type.value}
                            onChange={() => setFilter('type', type.value)}
                            className="w-4 h-4 accent-amber-500"
                          />
                          <span className="text-sm">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Bedrooms (min)</label>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          onClick={() => setFilter('bedsMin', num)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                            filters.bedsMin === num
                              ? 'bg-amber-500 text-white'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                          }`}
                        >
                          {num === 0 ? 'Any' : `${num}+`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Bathrooms (min)</label>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          onClick={() => setFilter('bathsMin', num)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                            filters.bathsMin === num
                              ? 'bg-amber-500 text-white'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                          }`}
                        >
                          {num === 0 ? 'Any' : `${num}+`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-neutral-600 dark:text-neutral-400">
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {sortedProperties.length}
                </span>{' '}
                properties found
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-neutral-500">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="sqft">Square Feet</option>
                  </select>
                </div>

                <div className="hidden md:flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-neutral-700 shadow-sm'
                        : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'map'
                        ? 'bg-white dark:bg-neutral-700 shadow-sm'
                        : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                    aria-label="Map view"
                  >
                    <Map className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProperties.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg h-[600px] flex items-center justify-center">
                <p className="text-neutral-500">Map view coming soon...</p>
              </div>
            )}

            {sortedProperties.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-neutral-500 mb-4">
                  No properties match your filters
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
