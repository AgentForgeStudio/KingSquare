'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { isTouchDevice, prefersReducedMotion } from '@/lib/utils';

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  direction?: 'up' | 'down';
  className?: string;
  disabled?: boolean;
}

export function ParallaxSection({
  children,
  speed = 0.4,
  direction = 'up',
  className,
  disabled = false,
}: ParallaxSectionProps) {
  if (isTouchDevice() || prefersReducedMotion() || disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn('parallax-container', className)}
      data-parallax-speed={speed}
      data-parallax-direction={direction}
      style={
        {
          '--parallax-speed': speed,
          '--parallax-direction': direction === 'up' ? -1 : 1,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
