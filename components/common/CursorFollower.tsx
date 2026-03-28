'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { isTouchDevice, prefersReducedMotion } from '@/lib/utils';

export function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (cursor) {
        cursor.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
      }
      if (dot) {
        dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const animate = () => {
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;

      if (cursor) {
        cursor.style.transform = `translate(${cursorPos.current.x - 20}px, ${cursorPos.current.y - 20}px)`;
      }
      if (dot) {
        dot.style.transform = `translate(${mousePos.current.x - 4}px, ${mousePos.current.y - 4}px)`;
      }

      requestAnimationFrame(animate);
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      }
    };

    const onHoverEnd = () => setIsHovering(false);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onHoverStart);
    document.addEventListener('mouseout', onHoverEnd);

    requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onHoverStart);
      document.removeEventListener('mouseout', onHoverEnd);
    };
  }, []);

  if (isTouchDevice() || prefersReducedMotion()) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-yellow-500/60 pointer-events-none z-[9999] transition-all duration-150 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${isHovering ? 'scale-150 border-yellow-400 bg-yellow-500/10' : ''} ${
          isClicking ? 'scale-75' : ''
        }`}
      />
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full bg-yellow-500 pointer-events-none z-[10000] transition-all duration-75 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${isHovering ? 'scale-200 bg-yellow-400' : ''}`}
      />
    </>
  );
}
