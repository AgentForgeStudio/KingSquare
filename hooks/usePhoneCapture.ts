'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useLeadStore } from '@/store/leadStore';
import { isTouchDevice } from '@/lib/utils';

interface UsePhoneCaptureOptions {
  slideInDelay?: number;
  enabled?: boolean;
}

export function usePhoneCapture(options: UsePhoneCaptureOptions = {}) {
  const { slideInDelay = 45000, enabled = true } = options;

  const timeOnSiteRef = useRef<NodeJS.Timeout | null>(null);
  const hasPhoneCaptured = useLeadStore((state) => state.phoneCapture);
  const markCaptured = useLeadStore((state) => state.markCaptured);

  const shouldShowSlideIn = useCallback(() => {
    if (typeof window === 'undefined') return false;
    if (hasPhoneCaptured) return false;
    if (isTouchDevice()) return false;
    
    const dismissed = sessionStorage.getItem('luxe_slide_in_dismissed');
    return !dismissed;
  }, [hasPhoneCaptured]);

  const dismissSlideIn = useCallback(() => {
    sessionStorage.setItem('luxe_slide_in_dismissed', 'true');
  }, []);

  const shouldShowExitIntent = useCallback(() => {
    if (typeof window === 'undefined') return false;
    if (hasPhoneCaptured) return false;
    if (isTouchDevice()) return false;
    
    const shown = sessionStorage.getItem('luxe_exit_shown');
    return !shown;
  }, [hasPhoneCaptured]);

  const markExitShown = useCallback(() => {
    sessionStorage.setItem('luxe_exit_shown', 'true');
  }, []);

  useEffect(() => {
    if (!enabled || hasPhoneCaptured) return;

    if (typeof window !== 'undefined') {
      const captured = localStorage.getItem('luxe_phone_captured');
      if (captured) {
        const data = JSON.parse(captured);
        markCaptured(data.phone, data.source);
        return;
      }
    }

    timeOnSiteRef.current = setTimeout(() => {
      if (shouldShowSlideIn()) {
        window.dispatchEvent(new CustomEvent('showPhoneSlideIn'));
      }
    }, slideInDelay);

    return () => {
      if (timeOnSiteRef.current) {
        clearTimeout(timeOnSiteRef.current);
      }
    };
  }, [enabled, hasPhoneCaptured, markCaptured, slideInDelay, shouldShowSlideIn]);

  return {
    hasPhoneCaptured,
    shouldShowSlideIn,
    dismissSlideIn,
    shouldShowExitIntent,
    markExitShown,
  };
}
