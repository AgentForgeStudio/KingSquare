'use client';

import { create } from 'zustand';

interface CallState {
  isModalOpen: boolean;
  isScheduleModalOpen: boolean;
  isCallActive: boolean;
  scheduledProperty: string | null;
  openCallOptions: () => void;
  closeCallOptions: () => void;
  openScheduleModal: (propertyName?: string) => void;
  closeScheduleModal: () => void;
  startCall: () => void;
  endCall: () => void;
}

export const useCallStore = create<CallState>((set) => ({
  isModalOpen: false,
  isScheduleModalOpen: false,
  isCallActive: false,
  scheduledProperty: null,

  openCallOptions: () => set({ isModalOpen: true }),

  closeCallOptions: () => set({ isModalOpen: false }),

  openScheduleModal: (propertyName) =>
    set({ isScheduleModalOpen: true, scheduledProperty: propertyName || null }),

  closeScheduleModal: () =>
    set({ isScheduleModalOpen: false, scheduledProperty: null }),

  startCall: () => set({ isCallActive: true, isModalOpen: false }),

  endCall: () => set({ isCallActive: false }),
}));
