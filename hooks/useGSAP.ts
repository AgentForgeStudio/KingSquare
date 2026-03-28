'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isTouchDevice, prefersReducedMotion } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseGSAPOptions {
  cleanupOnUnmount?: boolean;
}

export function useGSAP(options: UseGSAPOptions = {}) {
  const ctxRef = useRef<gsap.Context | null>(null);

  const createContext = useCallback((callback: (self: gsap.Context) => void) => {
    ctxRef.current = gsap.context(() => {
      callback(ctxRef.current!);
    });
  }, []);

  const revealOnScroll = useCallback(
    (
      element: HTMLElement | null,
      animation?: gsap.TweenVars,
      scrollOptions?: ScrollTrigger.Vars
    ) => {
      if (!element || isTouchDevice() || prefersReducedMotion()) return null;

      const vars: gsap.TweenVars = {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        ...animation,
      };

      const triggerOptions: ScrollTrigger.Vars = {
        start: 'top 85%',
        toggleActions: 'play none none none',
        ...scrollOptions,
      };

      gsap.set(element, { y: vars.y ?? 50, opacity: vars.opacity ?? 0 });

      return gsap.to(element, {
        ...vars,
        scrollTrigger: {
          trigger: element,
          ...triggerOptions,
        },
      });
    },
    []
  );

  const staggerReveal = useCallback(
    (
      elements: HTMLElement[] | NodeListOf<Element> | null,
      options: {
        stagger?: number;
        y?: number;
        duration?: number;
        delay?: number;
      } = {}
    ) => {
      if (!elements || elements.length === 0 || isTouchDevice() || prefersReducedMotion())
        return null;

      const { stagger = 0.06, y = 30, duration = 0.8, delay = 0 } = options;

      const targets = Array.from(elements);

      gsap.set(targets, { y, opacity: 0 });

      return gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration,
        delay,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: targets[0],
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    },
    []
  );

  const animateCounter = useCallback(
    (
      element: HTMLElement | null,
      endValue: number,
      options: {
        duration?: number;
        prefix?: string;
        suffix?: string;
        decimals?: number;
      } = {}
    ) => {
      if (!element) return null;

      const { duration = 2, prefix = '', suffix = '', decimals = 0 } = options;
      const counter = { value: 0 };

      return gsap.to(counter, {
        value: endValue,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          const formatted = counter.value.toFixed(decimals);
          element.textContent = `${prefix}${Number(formatted).toLocaleString()}${suffix}`;
        },
      });
    },
    []
  );

  const createParallax = useCallback(
    (
      element: HTMLElement | null,
      speed: number = 0.4,
      direction: 'up' | 'down' = 'up'
    ) => {
      if (!element || isTouchDevice() || prefersReducedMotion()) return null;

      const yPercent = direction === 'up' ? -speed * 100 : speed * 100;

      return gsap.to(element, {
        yPercent,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    },
    []
  );

  useEffect(() => {
    return () => {
      if (options.cleanupOnUnmount && ctxRef.current) {
        ctxRef.current.revert();
      }
    };
  }, [options.cleanupOnUnmount]);

  return {
    gsap,
    ScrollTrigger,
    ctx: ctxRef.current,
    createContext,
    revealOnScroll,
    staggerReveal,
    animateCounter,
    createParallax,
  };
}
