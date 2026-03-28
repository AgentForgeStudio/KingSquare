'use client';

import { useCallback } from 'react';
import { createStreamingChatCompletion } from '@/lib/openai';
import { useChatStore } from '@/store/chatStore';

export function useChat() {
  const { messages, isTyping, context, addMessage, setTyping, incrementMessageCount } =
    useChatStore();

  const sendMessage = useCallback(
    async (content: string) => {
      addMessage({ role: 'user', content });
      incrementMessageCount();
      setTyping(true);

      try {
        const chatMessages = messages
          .filter((m) => m.role !== 'system')
          .map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          }));

        chatMessages.push({ role: 'user', content });

        let fullResponse = '';
        
        await createStreamingChatCompletion(
          chatMessages,
          (chunk) => {
            fullResponse += chunk;
          },
          context
        );

        addMessage({ role: 'assistant', content: fullResponse });
      } catch (error) {
        console.error('Chat error:', error);
        addMessage({
          role: 'assistant',
          content: 'I apologize, but I encountered an issue. Please try again.',
        });
      } finally {
        setTyping(false);
      }
    },
    [messages, context, addMessage, setTyping, incrementMessageCount]
  );

  return {
    messages,
    isTyping,
    sendMessage,
  };
}
