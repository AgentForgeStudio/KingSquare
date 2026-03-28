'use client';

import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isTyping: boolean;
}

export function ChatInput({ onSend, isTyping }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isTyping) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-800">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isTyping}
          className="flex-1 px-4 py-3 bg-neutral-800 rounded-xl text-white text-sm border border-neutral-700 focus:border-amber-500 focus:outline-none transition-colors placeholder:text-neutral-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!message.trim() || isTyping}
          className="p-3 bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-700 disabled:cursor-not-allowed rounded-xl transition-colors"
          aria-label="Send message"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </form>
  );
}
