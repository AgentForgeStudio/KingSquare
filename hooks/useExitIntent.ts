'use client';

import { useEffect, useCallback, useRef } from 'react';
import { isTouchDevice } from '@/lib/utils';

interface UseExitIntentOptions {
  enabled?: boolean;
  onExitIntent?: () => void;
}

export function useExitIntent(options: UseExitIntentOptions = {}) {
  const { enabled = true, onExitIntent } = options;
  const triggeredRef = useRef(false);

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (!enabled || triggeredRef.current || isTouchDevice()) return;
      if (e.clientY <= 0) {
        triggeredRef.current = true;
        onExitIntent?.();
      }
    },
    [enabled, onExitIntent]
  );

  const handlePopstate = useCallback(() => {
    if (!enabled || triggeredRef.current) return;
    if (isTouchDevice()) {
      triggeredRef.current = true;
      onExitIntent?.();
    }
  }, [enabled, onExitIntent]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('popstate', handlePopstate);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('popstate', handlePopstate);
    };
  }, [enabled, handleMouseLeave, handlePopstate]);

  return {
    triggered: triggeredRef.current,
  };
}
