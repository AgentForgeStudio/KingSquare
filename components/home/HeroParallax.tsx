'use client';

import { useEffect, useRef, useCallback } from 'react';

export function HeroParallax() {
  const skyRef = useRef<HTMLDivElement>(null);
  const buildingRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const cloudLRef = useRef<HTMLDivElement>(null);
  const cloudRRef = useRef<HTMLDivElement>(null);
  const cloudBtmRef = useRef<HTMLDivElement>(null);

  const lerpedScroll = useRef(0);
  const targetScroll = useRef(0);
  const rafId = useRef<number>(0);
  const isRunning = useRef(false);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const tick = useCallback(() => {
    const prev = lerpedScroll.current;
    lerpedScroll.current = lerp(prev, targetScroll.current, 0.068);

    const s = lerpedScroll.current;
    const vh = window.innerHeight;

    const raw = Math.min(s / (vh * 1.3), 1);
    const p = 1 - Math.pow(1 - raw, 3);

    if (skyRef.current) {
      skyRef.current.style.transform = `translateY(${p * 55}px) scale(${1 + p * 0.05})`;
    }

    if (buildingRef.current) {
      const scale = 1 + p * 0.28;
      const ty = -p * 45;
      buildingRef.current.style.transform = `translateX(-50%) translateY(${ty}vh) scale(${scale})`;
    }

    const textP = Math.max(1 - raw * 3.2, 0);
    if (textRef.current) {
      textRef.current.style.opacity = String(textP);
      textRef.current.style.transform = `translateY(${-p * 60}px)`;
    }
    if (navRef.current) {
      navRef.current.style.opacity = String(textP);
    }

    const cRaw = Math.min(raw * 1.6, 1);
    const cP = 1 - Math.pow(1 - cRaw, 3);
    if (cloudLRef.current) {
      cloudLRef.current.style.opacity = String(cP);
      cloudLRef.current.style.transform = `translateX(${(1 - cP) * -380}px)`;
    }
    if (cloudRRef.current) {
      cloudRRef.current.style.opacity = String(cP);
      cloudRRef.current.style.transform = `translateX(${(1 - cP) * 380}px)`;
    }

    const bRaw = Math.min(raw * 2.2, 1);
    const bP = 1 - Math.pow(1 - bRaw, 3);
    if (cloudBtmRef.current) {
      cloudBtmRef.current.style.opacity = String(bP);
      cloudBtmRef.current.style.transform = `translateX(-50%) translateY(${(1 - bP) * 180}px)`;
    }

    if (Math.abs(lerpedScroll.current - targetScroll.current) > 0.25) {
      rafId.current = requestAnimationFrame(tick);
    } else {
      lerpedScroll.current = targetScroll.current;
      isRunning.current = false;
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      targetScroll.current = window.scrollY;
      if (!isRunning.current) {
        isRunning.current = true;
        rafId.current = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [tick]);

  return {
    skyRef,
    buildingRef,
    textRef,
    navRef,
    cloudLRef,
    cloudRRef,
    cloudBtmRef,
  };
}
