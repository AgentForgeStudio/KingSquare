'use client';

import { useCallback, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { isTouchDevice, prefersReducedMotion } from '@/lib/utils';

interface UseParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down';
  disabled?: boolean;
}

export function useParallax(options: UseParallaxOptions = {}) {
  const { speed = 0.4, direction = 'up', disabled = false } = options;

  const elementRef = useRef<HTMLElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [isActive, setIsActive] = useState(false);

  const initParallax = useCallback(
    (element: HTMLElement | null) => {
      if (
        !element ||
        disabled ||
        isTouchDevice() ||
        prefersReducedMotion() ||
        typeof window === 'undefined'
      ) {
        return;
      }

      elementRef.current = element;

      const yPercent = direction === 'up' ? -speed * 100 : speed * 100;

      tweenRef.current = gsap.to(element, {
        yPercent,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      setIsActive(true);
    },
    [speed, direction, disabled]
  );

  const destroy = useCallback(() => {
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }
    setIsActive(false);
  }, []);

  return {
    initParallax,
    destroy,
    isActive,
    elementRef,
  };
}
