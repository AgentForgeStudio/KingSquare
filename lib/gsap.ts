'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export function createParallax(
  element: HTMLElement | null,
  speed: number = 0.4,
  direction: 'up' | 'down' = 'up'
): gsap.core.Tween | null {
  if (!element) return null;

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
}

export function revealOnScroll(
  element: HTMLElement | null,
  options: {
    y?: number;
    opacity?: number;
    duration?: number;
    delay?: number;
  } = {}
): gsap.core.Tween | null {
  if (!element) return null;

  const { y = 50, opacity = 0, duration = 0.9, delay = 0 } = options;

  gsap.set(element, { y, opacity });

  return gsap.to(element, {
    y: 0,
    opacity: 1,
    duration,
    delay,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}

export function staggerReveal(
  elements: HTMLElement[] | NodeListOf<Element>,
  options: {
    stagger?: number;
    y?: number;
    duration?: number;
  } = {}
): gsap.core.Tween | null {
  if (!elements.length) return null;

  const { stagger = 0.06, y = 30, duration = 0.8 } = options;

  gsap.set(elements, { y, opacity: 0 });

  return gsap.to(elements, {
    y: 0,
    opacity: 1,
    duration,
    stagger,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: elements[0],
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}

export function animateCounter(
  element: HTMLElement | null,
  endValue: number,
  options: {
    duration?: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
  } = {}
): gsap.core.Tween | null {
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
}
