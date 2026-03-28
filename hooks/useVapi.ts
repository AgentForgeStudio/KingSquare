'use client';

import { useCallback, useRef, useState } from 'react';
import { useCallStore } from '@/store/callStore';

type CallStatus = 'idle' | 'connecting' | 'active' | 'ended' | 'error';

interface UseVapiOptions {
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onError?: (error: string) => void;
}

export function useVapi(options: UseVapiOptions = {}) {
  const { onCallStart, onCallEnd, onError } = options;

  const [status, setStatus] = useState<CallStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startCall = useCallback(async () => {
    setStatus('connecting');
    setError(null);

    try {
      const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error('VAPI public key not configured');
      }

      const assistantConfig = {
        name: 'LUXE Estate Agent',
        firstMessage:
          "Hello! Thank you for calling LUXE Estates. I'm your AI property consultant. May I have your name please?",
        transcriber: { provider: 'deepgram' as const, model: 'nova-2' as const, language: 'en-US' },
        voice: { provider: '11labs' as const, voiceId: 'rachel' },
        model: {
          provider: 'openai' as const,
          model: 'gpt-4o',
          systemPrompt:
            "You are a professional luxury real estate agent for LUXE Estates. Be warm, professional, concise — this is a voice call, no markdown. Ask qualifying questions: budget range, preferred location, property type, timeline. IMPORTANT: Within the first 2 minutes naturally ask for their phone number for follow-up: 'Could I get your mobile number so we can send you matching properties?' Store the number mentally and repeat it back to confirm. Keep responses under 3 sentences.",
        },
      };

      console.log('VAPI call would start with config:', assistantConfig);

      setTimeout(() => {
        setStatus('active');
        startTimeRef.current = Date.now();
        
        timerRef.current = setInterval(() => {
          setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 1000);

        onCallStart?.();
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start call';
      setError(errorMessage);
      setStatus('error');
      onError?.(errorMessage);
    }
  }, [onCallStart, onError]);

  const endCall = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStatus('ended');
    setIsMuted(false);
    onCallEnd?.();
  }, [onCallEnd]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setDuration(0);
    setError(null);
    setIsMuted(false);
  }, []);

  return {
    status,
    isMuted,
    duration,
    volumeLevel,
    error,
    startCall,
    endCall,
    toggleMute,
    reset,
  };
}
