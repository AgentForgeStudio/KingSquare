'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

type CallStatus = 'idle' | 'connecting' | 'active' | 'ended' | 'error';

interface UseVapiOptions {
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onError?: (error: string) => void;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message?: string }).message ?? 'Unknown Vapi error');
  }

  return 'Failed to start call';
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
  const vapiRef = useRef<Vapi | null>(null);
  const hasEndedRef = useRef(false);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cleanupCall = useCallback(() => {
    stopTimer();
    vapiRef.current?.removeAllListeners();
    vapiRef.current = null;
    setVolumeLevel(0);
    setIsMuted(false);
  }, [stopTimer]);

  const startCall = useCallback(async () => {
    setStatus('connecting');
    setError(null);

    try {
      const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

      if (!publicKey) {
        throw new Error('Vapi public key is missing. Set NEXT_PUBLIC_VAPI_PUBLIC_KEY.');
      }

      const vapi = new Vapi(publicKey);
      vapiRef.current = vapi;
      hasEndedRef.current = false;

      vapi.on('call-start', () => {
        setStatus('active');
        startTimeRef.current = Date.now();
        stopTimer();

        timerRef.current = setInterval(() => {
          setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 1000);

        onCallStart?.();
      });

      vapi.on('call-end', () => {
        if (hasEndedRef.current) return;
        hasEndedRef.current = true;
        setStatus('ended');
        cleanupCall();
        onCallEnd?.();
      });

      vapi.on('volume-level', (volume) => {
        setVolumeLevel(volume);
      });

      vapi.on('error', (eventError) => {
        const message = toErrorMessage(eventError);
        setError(message);
        setStatus('error');
        cleanupCall();
        onError?.(message);
      });

      if (assistantId) {
        await vapi.start(assistantId);
      } else {
        await vapi.start({
          name: 'KingSquare Estate Agent',
          firstMessage:
            "Hello! Thank you for calling KingSquare. I'm your AI property consultant. May I have your name please?",
          transcriber: { provider: 'deepgram', model: 'nova-2', language: 'en-US' },
          voice: { provider: '11labs', voiceId: 'rachel' },
          model: {
            provider: 'openai',
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content:
                  "You are a professional luxury real estate agent for KingSquare. Be warm and concise because this is a live voice call. Ask qualifying questions about budget range, preferred location, property type, and timeline. Ask for the caller's mobile number within the first 2 minutes for follow-up and repeat it back for confirmation. Keep replies to 3 sentences maximum. IMPORTANT: You only provide information about properties in Naigaon, Vasai, Nallasopara, and Virar. PROPERTY CONTEXT: - Sunteck One World (Naigaon): ₹40.8 L - 65.43 L - Deep Sky (Naigaon): ₹41.99 L - 47.6 L - JSB Nakshatra Aazstha (Naigaon): ₹34.5 L - 53.78 L - JSB Nakshatra Veda II (Virar): ₹33.19 L - 94.55 L - Wonder Park (Naigaon): ₹44.02 L - 63.82 L - Vailankanni JK Heritage (Vasai): ₹32.5 L - 33.9 L - AVA Sereno (Vasai): ₹39.0 L - 57.0 L - Navkar City Phase I Part 8 (Naigaon): ₹33.93 L - 48.03 L - Sunteck Beach Residences 1 (Vasai): ₹90.0 L - 1.35 Cr - Ornate Height (Naigaon): Price on Request - JSB Nakshatra Prithvi (Vasai): ₹73.21 L - 1.07 Cr - JSB Nakshatra Veda II (Umela, Naigaon): ₹33.19 L - 94.55 L - Neminath Hiloni Heights (Vasai): ₹40.83 L - 62.6 L",
              },
            ],
          },
        });
      }
    } catch (err) {
      const message = toErrorMessage(err);
      setError(message);
      setStatus('error');
      cleanupCall();
      onError?.(message);
    }
  }, [cleanupCall, onCallEnd, onCallStart, onError, stopTimer]);

  const endCall = useCallback(() => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;

    const current = vapiRef.current;
    try {
      current?.end();
    } catch {
      // no-op
    }

    // Fallback close path for web sessions where end() is ignored by transport.
    void current
      ?.stop()
      .catch(() => {
        // no-op
      });

    setStatus('ended');
    cleanupCall();
    onCallEnd?.();
  }, [cleanupCall, onCallEnd]);

  const toggleMute = useCallback(() => {
    const current = vapiRef.current;
    if (!current) return;

    setIsMuted((prev) => {
      const next = !prev;
      try {
        current.setMuted(next);
      } catch {
        return prev;
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    cleanupCall();
    setStatus('idle');
    setDuration(0);
    setError(null);
  }, [cleanupCall]);

  useEffect(() => {
    return () => {
      cleanupCall();
    };
  }, [cleanupCall]);

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
