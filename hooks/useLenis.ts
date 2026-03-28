'use client';

import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseLenisOptions {
  duration?: number;
  wheelMultiplier?: number;
  touchMultiplier?: number;
}

export function useLenis(options: UseLenisOptions = {}) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const initLenis = useCallback(() => {
    if (lenisRef.current) return;

    lenisRef.current = new Lenis({
      duration: options.duration ?? 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: options.wheelMultiplier ?? 1,
      touchMultiplier: options.touchMultiplier ?? 2,
    });

    lenisRef.current.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenisRef.current?.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };

    rafIdRef.current = requestAnimationFrame(raf);
  }, [options.duration, options.wheelMultiplier, options.touchMultiplier]);

  const destroyLenis = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (lenisRef.current) {
      lenisRef.current.destroy();
      lenisRef.current = null;
    }
  }, []);

  const scrollTo = useCallback(
    (target: string | number | HTMLElement, options?: object) => {
      lenisRef.current?.scrollTo(target, options);
    },
    []
  );

  useEffect(() => {
    initLenis();

    return () => {
      destroyLenis();
    };
  }, [initLenis, destroyLenis]);

  return {
    lenis: lenisRef.current,
    scrollTo,
    destroy: destroyLenis,
  };
}
