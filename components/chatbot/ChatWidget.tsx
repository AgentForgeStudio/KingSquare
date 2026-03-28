'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, CheckCircle } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useCallStore } from '@/store/callStore';
import { ChatInput } from './ChatInput';
import { ChatBubble } from './ChatBubble';
import { TypingIndicator } from './TypingIndicator';
import { EnquiryForm } from './EnquiryForm';

const QUICK_REPLIES = [
  { id: 'browse', label: '🏠 Browse Properties', action: 'browse' },
  { id: 'neighborhoods', label: '📍 Explore Neighborhoods', action: 'neighborhoods' },
  { id: 'calculator', label: '💰 Mortgage Calculator', action: 'calculator' },
  { id: 'agent', label: '📞 Talk to an Agent', action: 'agent' },
];

export function ChatWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [showUnread, setShowUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isTyping,
    activeTab,
    setOpen,
    setActiveTab,
    addMessage,
    setTyping,
    messageCount,
    phoneCapturedInChat,
    markPhoneCapturedInChat,
    incrementMessageCount,
  } = useChatStore();
  
  const openCallOptions = useCallStore((state) => state.openCallOptions);

  useEffect(() => {
    if (isVisible) {
      setShowUnread(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isVisible, messages]);

  useEffect(() => {
    if (isVisible && messages.length === 0) {
      const timer = setTimeout(() => {
        addMessage({ role: 'assistant', content: "Hello! I'm LUXE AI 👋" });
        setTimeout(() => {
          addMessage({
            role: 'assistant',
            content: 'How can I help you find your dream home?',
            type: 'quick-reply',
          });
        }, 800);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, messages.length, addMessage]);

  useEffect(() => {
    if (messageCount >= 3 && !phoneCapturedInChat) {
      setTimeout(() => {
        addMessage({
          role: 'assistant',
          content:
            "By the way, would you like me to send these property recommendations to your WhatsApp? It's much easier to browse there. Just drop your number below 👇",
          type: 'phone-capture-request',
        });
      }, 2000);
    }
  }, [messageCount, phoneCapturedInChat, addMessage]);

  const handleQuickReply = (action: string) => {
    if (action === 'agent') {
      setOpen(false);
      openCallOptions();
      return;
    }

    const responses: Record<string, string> = {
      browse: "Great! Let me show you our featured properties. We have some amazing luxury listings that might interest you. Would you like to filter by location, price, or type?",
      neighborhoods: "We operate in the most sought-after neighborhoods! From Bandra and Juhu in Mumbai, to Downtown Dubai and Manhattan. Which area catches your eye?",
      calculator: "Our mortgage calculator can help you estimate monthly payments. What property price range are you considering? I can give you a rough idea of the investment required.",
    };

    addMessage({ role: 'user', content: QUICK_REPLIES.find((q) => q.id === action)?.label || '' });
    incrementMessageCount();
    setTyping(true);

    setTimeout(() => {
      addMessage({ role: 'assistant', content: responses[action] || "I'd be happy to help with that!" });
      setTyping(false);
    }, 1500);
  };

  const handleSendMessage = async (content: string) => {
    addMessage({ role: 'user', content });
    incrementMessageCount();
    setTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      if (data.response) {
        addMessage({ role: 'assistant', content: data.response });
      }
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: 'I apologize, but I encountered an issue. Please try again.',
      });
    } finally {
      setTyping(false);
    }
  };

  const handlePhoneCaptured = () => {
    markPhoneCapturedInChat();
    addMessage({
      role: 'assistant',
      content: "Perfect! I'll send those property recommendations to your WhatsApp. What else can I help you with?",
    });
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-4 md:right-8 z-50 w-[380px] max-w-[calc(100vw-2rem)] md:w-[420px] h-[600px] max-h-[calc(100vh-8rem)] bg-neutral-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-800 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">LUXE AI Assistant</h3>
                  <p className="text-neutral-400 text-xs">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <div className="flex border-b border-neutral-800">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'chat' ? 'text-amber-500' : 'text-neutral-400 hover:text-white'
                }`}
              >
                💬 Chat
                {activeTab === 'chat' && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('enquiry')}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'enquiry' ? 'text-amber-500' : 'text-neutral-400 hover:text-white'
                }`}
              >
                📋 Enquiry
                {activeTab === 'enquiry' && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTab === 'chat' ? (
                <>
                  {messages.map((message) => (
                    <ChatBubble
                      key={message.id}
                      message={message}
                      onQuickReply={handleQuickReply}
                      onPhoneCapture={handlePhoneCaptured}
                      showPhoneCapture={
                        message.type === 'phone-capture-request' && !phoneCapturedInChat
                      }
                    />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <EnquiryForm />
              )}
            </div>

            {activeTab === 'chat' && (
              <ChatInput onSend={handleSendMessage} isTyping={isTyping} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => {
          if (!isVisible) {
            setShowUnread(true);
          }
          setOpen(!isVisible);
        }}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform group"
        aria-label="Open chat"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        <span className="absolute inset-0 rounded-full bg-amber-500 animate-pulse-ring" />
        {showUnread && isVisible && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
            1
          </span>
        )}
      </button>
    </>
  );
}
