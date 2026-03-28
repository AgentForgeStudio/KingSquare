'use client';

import { create } from 'zustand';
import type { PropertyFilters, PropertyType, PropertyStatus } from '@/types/property';

interface FilterState {
  filters: PropertyFilters;
  sortBy: 'price-asc' | 'price-desc' | 'newest' | 'sqft';
  viewMode: 'grid' | 'map';
  setFilter: <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K]
  ) => void;
  resetFilters: () => void;
  setSortBy: (sort: FilterState['sortBy']) => void;
  setViewMode: (mode: FilterState['viewMode']) => void;
}

const initialFilters: PropertyFilters = {
  type: 'all',
  status: 'all',
  priceMin: 0,
  priceMax: 100000000,
  bedsMin: 0,
  bathsMin: 0,
  sqftMin: 0,
  sqftMax: 100000,
  amenities: [],
};

export const useFilterStore = create<FilterState>((set) => ({
  filters: initialFilters,
  sortBy: 'newest',
  viewMode: 'grid',

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () => set({ filters: initialFilters }),

  setSortBy: (sortBy) => set({ sortBy }),

  setViewMode: (viewMode) => set({ viewMode }),
}));
