'use client';

import { useEffect, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────
// HeroParallax — custom hook
//
// Returns refs you attach to DOM elements in your hero section.
// Works with a WHITE / light background: the overlay darkens the
// photo, clouds slide in from the sides, and the building zooms
// as the user scrolls.  Text + nav fade out quickly so the image
// can breathe underneath.
//
// Usage example:
//
//   import { HeroParallax } from './hero-parallax';
//
//   export default function HeroSection() {
//     const {
//       skyRef, buildingRef, textRef, navRef,
//       cloudLRef, cloudRRef, cloudBtmRef,
//       overlayRef, taglineRef,
//     } = HeroParallax();
//
//     return (
//       <div style={{ position: 'relative', height: '100vh', overflow: 'hidden',
//                     backgroundColor: '#F7F4EE' }}>
//
//         {/* Sky / background photo */}
//         <div ref={skyRef} style={{ position: 'absolute', inset: 0,
//           backgroundImage: 'url(...)', backgroundSize: 'cover' }} />
//
//         {/* Progressive dark overlay (light → dark as you scroll) */}
//         <div ref={overlayRef} style={{ position: 'absolute', inset: 0,
//           backgroundColor: 'rgba(247,244,238,0)', pointerEvents: 'none' }} />
//
//         {/* Building / hero image layer */}
//         <div ref={buildingRef} style={{ position: 'absolute', bottom: 0,
//           left: '50%', transform: 'translateX(-50%)' }}>
//           <img src="..." alt="building" />
//         </div>
//
//         {/* Left cloud */}
//         <div ref={cloudLRef} style={{ position: 'absolute', left: 0,
//           top: '20%', opacity: 0 }}>
//           <img src="cloud-left.png" alt="" />
//         </div>
//
//         {/* Right cloud */}
//         <div ref={cloudRRef} style={{ position: 'absolute', right: 0,
//           top: '20%', opacity: 0 }}>
//           <img src="cloud-right.png" alt="" />
//         </div>
//
//         {/* Bottom cloud */}
//         <div ref={cloudBtmRef} style={{ position: 'absolute', bottom: '-60px',
//           left: '50%', transform: 'translateX(-50%)', opacity: 0 }}>
//           <img src="cloud-btm.png" alt="" />
//         </div>
//
//         {/* Nav bar */}
//         <nav ref={navRef} style={{ position: 'absolute', top: 0, left: 0,
//           right: 0, zIndex: 20 }}>
//           ...
//         </nav>
//
//         {/* Hero text */}
//         <div ref={textRef} style={{ position: 'absolute', inset: 0,
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           zIndex: 10 }}>
//           <h1>Find Your Home</h1>
//           <p ref={taglineRef}>Curated luxury across the world's finest addresses.</p>
//         </div>
//       </div>
//     );
//   }
// ─────────────────────────────────────────────────────────────────

export function HeroParallax() {
  // DOM refs
  const skyRef      = useRef<HTMLDivElement>(null);
  const buildingRef = useRef<HTMLDivElement>(null);
  const textRef     = useRef<HTMLDivElement>(null);
  const navRef      = useRef<HTMLDivElement>(null);
  const cloudLRef   = useRef<HTMLDivElement>(null);
  const cloudRRef   = useRef<HTMLDivElement>(null);
  const cloudBtmRef = useRef<HTMLDivElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);
  const taglineRef  = useRef<HTMLElement>(null);

  // Animation state
  const lerpedScroll = useRef(0);
  const targetScroll = useRef(0);
  const rafId        = useRef<number>(0);
  const isRunning    = useRef(false);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const tick = useCallback(() => {
    lerpedScroll.current = lerp(lerpedScroll.current, targetScroll.current, 0.068);

    const s   = lerpedScroll.current;
    const vh  = window.innerHeight;
    const raw = Math.min(s / (vh * 1.3), 1);
    const p   = 1 - Math.pow(1 - raw, 3);   // ease-out cubic

    // ── Sky / background ──────────────────────────────────────
    if (skyRef.current) {
      skyRef.current.style.transform = `translateY(${p * 55}px) scale(${1 + p * 0.05})`;
    }

    // ── Building / foreground image ───────────────────────────
    if (buildingRef.current) {
      buildingRef.current.style.transform =
        `translateX(-50%) translateY(${-p * 45}vh) scale(${1 + p * 0.28})`;
    }

    // ── Hero text ─────────────────────────────────────────────
    const textP = Math.max(1 - raw * 3.2, 0);
    if (textRef.current) {
      textRef.current.style.opacity   = String(textP);
      textRef.current.style.transform = `translateY(${-p * 60}px)`;
    }

    // ── Nav bar ───────────────────────────────────────────────
    if (navRef.current) {
      navRef.current.style.opacity = String(textP);
    }

    // ── Overlay: barely there → dense as scroll deepens ──────
    // Light theme: transitions from transparent to a warm neutral,
    // so the photo reads clearly at the top and dims on scroll.
    if (overlayRef.current) {
      const alpha = p * 0.72;
      overlayRef.current.style.backgroundColor = `rgba(247,244,238,${alpha})`;
    }

    // ── Tagline fades faster than the main heading ────────────
    if (taglineRef.current) {
      taglineRef.current.style.opacity = String(Math.max(1 - raw * 2.5, 0));
    }

    // ── Clouds slide in from left / right ─────────────────────
    const cRaw = Math.min(raw * 1.6, 1);
    const cP   = 1 - Math.pow(1 - cRaw, 3);

    if (cloudLRef.current) {
      cloudLRef.current.style.opacity   = String(cP);
      cloudLRef.current.style.transform = `translateX(${(1 - cP) * -380}px)`;
    }
    if (cloudRRef.current) {
      cloudRRef.current.style.opacity   = String(cP);
      cloudRRef.current.style.transform = `translateX(${(1 - cP) * 380}px)`;
    }

    // ── Bottom cloud slides up ────────────────────────────────
    const bRaw = Math.min(raw * 2.2, 1);
    const bP   = 1 - Math.pow(1 - bRaw, 3);

    if (cloudBtmRef.current) {
      cloudBtmRef.current.style.opacity   = String(bP);
      cloudBtmRef.current.style.transform =
        `translateX(-50%) translateY(${(1 - bP) * 180}px)`;
    }

    // ── Loop until settled ────────────────────────────────────
    if (Math.abs(lerpedScroll.current - targetScroll.current) > 0.25) {
      rafId.current = requestAnimationFrame(tick);
    } else {
      lerpedScroll.current = targetScroll.current;
      isRunning.current    = false;
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
    overlayRef,
    taglineRef,
  };
}

export default HeroParallax;