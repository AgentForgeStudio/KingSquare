'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LeadState } from '@/types/lead';

const initialState = {
  phone: null,
  name: null,
  email: null,
  phoneCapture: false,
  captureSource: null,
  capturedAt: null,
};

export const useLeadStore = create<LeadState>()(
  persist(
    (set) => ({
      ...initialState,

      setLead: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      markCaptured: (phone, source) =>
        set((state) => {
          const capturedAt = new Date().toISOString();
          if (typeof window !== 'undefined') {
            localStorage.setItem(
              'luxe_phone_captured',
              JSON.stringify({ phone, source, capturedAt })
            );
          }
          return {
            ...state,
            phone,
            phoneCapture: true,
            captureSource: source,
            capturedAt,
          };
        }),

      reset: () => set(initialState),
    }),
    {
      name: 'luxe-lead-store',
    }
  )
);
