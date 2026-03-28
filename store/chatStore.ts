'use client';

import { create } from 'zustand';
import type { ChatMessage, ChatContext } from '@/types/chat';
import { generateId } from '@/lib/utils';

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  isOpen: boolean;
  activeTab: 'chat' | 'enquiry';
  context: ChatContext;
  messageCount: number;
  phoneCapturedInChat: boolean;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setTyping: (typing: boolean) => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  setActiveTab: (tab: 'chat' | 'enquiry') => void;
  setContext: (context: ChatContext) => void;
  incrementMessageCount: () => void;
  markPhoneCapturedInChat: () => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isTyping: false,
  isOpen: false,
  activeTab: 'chat',
  context: {},
  messageCount: 0,
  phoneCapturedInChat: false,

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        },
      ],
    })),

  setTyping: (isTyping) => set({ isTyping }),

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  setOpen: (isOpen) => set({ isOpen }),

  setActiveTab: (activeTab) => set({ activeTab }),

  setContext: (context) => set({ context }),

  incrementMessageCount: () =>
    set((state) => ({ messageCount: state.messageCount + 1 })),

  markPhoneCapturedInChat: () => set({ phoneCapturedInChat: true }),

  clearMessages: () => set({ messages: [], messageCount: 0 }),
}));
