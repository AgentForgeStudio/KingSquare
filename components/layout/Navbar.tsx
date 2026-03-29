'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X } from 'lucide-react';
import { useCallStore } from '@/store/callStore';
import { cn } from '@/lib/utils';
import { MobileMenu } from './MobileMenu';

const navLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/about',      label: 'About'      },
  { href: '/blog',       label: 'Blog'        },
  { href: '/contact',    label: 'Contact'     },
];

/* ─── Tile shimmer effect on individual nav items ─── */
function TileNavItem({
  href,
  label,
  active,
  isTransparent,
}: {
  href: string;
  label: string;
  active: boolean;
  isTransparent: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [ripple, setRipple]   = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    setHovered(true);
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <Link
      ref={ref}
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => { setHovered(false); setRipple(null); }}
      className={cn(
        'relative px-4 py-2 rounded-xl text-sm font-medium overflow-hidden',
        'transition-colors duration-200 select-none',
        active
          ? 'text-amber-500'
          : isTransparent
          ? 'text-neutral-900 hover:text-neutral-900'
          : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
      )}
      style={{ letterSpacing: '0.03em' }}
    >
      {/* Tile shimmer background */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="tile"
            className="absolute inset-0 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              background: isTransparent
                ? 'rgba(0,0,0,0.06)'
                : 'rgba(0,0,0,0.05)',
              backdropFilter: 'blur(4px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Ripple */}
      <AnimatePresence>
        {ripple && (
          <motion.span
            key="ripple"
            className="absolute rounded-full pointer-events-none"
            initial={{ width: 0, height: 0, opacity: 0.25, x: ripple.x, y: ripple.y, translateX: '-50%', translateY: '-50%' }}
            animate={{ width: 120, height: 120, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{
              background: active ? 'rgba(245,158,11,0.25)' : 'rgba(0,0,0,0.08)',
              left: 0, top: 0,
            }}
          />
        )}
      </AnimatePresence>

      <span className="relative z-10">{label}</span>

      {/* Active dot */}
      {active && (
        <motion.span
          layoutId="nav-active-dot"
          className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500"
        />
      )}
    </Link>
  );
}

/* ─── Tile CTA button ─── */
function TileCTA({ onClick, isTransparent }: { onClick: () => void; isTransparent: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative flex items-center gap-2 px-5 py-2.5 rounded-xl overflow-hidden',
        'text-sm font-semibold tracking-wide transition-colors duration-200',
        'border',
        isTransparent
          ? 'border-neutral-900/20 text-neutral-900'
          : 'border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white'
      )}
      style={{ letterSpacing: '0.04em' }}
    >
      {/* Tile fill on hover */}
      <motion.span
        className="absolute inset-0"
        animate={{
          background: hovered
            ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
            : 'transparent',
        }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
      />

      {/* Shimmer sweep */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="shimmer"
            className="absolute inset-0 pointer-events-none"
            initial={{ x: '-100%', opacity: 0.6 }}
            animate={{ x: '160%', opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
              transform: 'skewX(-20deg)',
            }}
          />
        )}
      </AnimatePresence>

      <Phone
        className="w-3.5 h-3.5 relative z-10 transition-colors duration-200"
        style={{ color: hovered ? '#fff' : 'currentColor' }}
      />
      <span
        className="relative z-10 transition-colors duration-200"
        style={{ color: hovered ? '#fff' : 'currentColor' }}
      >
        Talk to Agent
      </span>
    </button>
  );
}

/* ─── Main Navbar ─── */
export function Navbar() {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [isMobileMenuOpen, setIsMobileMenu] = useState(false);
  const pathname   = usePathname();
  const openCallOptions = useCallStore((s) => s.openCallOptions);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHomePage    = pathname === '/';
  const isTransparent = !isScrolled && isHomePage;

  return (
    <>
      <motion.nav
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0,   opacity: 1  }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-300',
        )}
      >
        {/* ── TILE GLASS PANEL ── */}
        <div
          className={cn(
            'mx-3 mt-3 rounded-2xl transition-all duration-300',
            isTransparent
              ? [
                  'bg-white/60 backdrop-blur-xl',
                  'border border-white/40',
                  'shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)]',
                  // Subtle inner top highlight — the "tile" premium touch
                  '[box-shadow:inset_0_1px_0_rgba(255,255,255,0.9),0_4px_24px_rgba(0,0,0,0.07)]',
                ]
              : [
                  'bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl',
                  'border border-neutral-200/80 dark:border-neutral-800/80',
                  'shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_32px_rgba(0,0,0,0.08)]',
                  'dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.3)]',
                ]
          )}
        >
          {/* Inner tile texture line */}
          <div
            className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
            style={{
              background: isTransparent
                ? 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.9) 60%, transparent 95%)'
                : 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.6) 60%, transparent 95%)',
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">

              {/* LOGO */}
              <Link href="/" className="group flex items-center gap-2.5">
                {/* Tile logo mark */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    'shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_8px_rgba(0,0,0,0.15)]',
                    'bg-gradient-to-br from-neutral-900 to-neutral-800',
                  )}
                >
                  <span className="text-white text-xs font-bold tracking-wider">F</span>
                </motion.div>
                <span
                  className={cn(
                    'text-xl font-bold tracking-[-0.04em]',
                    'font-serif',
                    isTransparent
                      ? 'text-neutral-900'
                      : 'text-neutral-900 dark:text-white'
                  )}
                >
                  FIND
                </span>
              </Link>

              {/* DESKTOP NAV LINKS */}
              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => (
                  <TileNavItem
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    active={pathname === link.href}
                    isTransparent={isTransparent}
                  />
                ))}
              </div>

              {/* DESKTOP CTA */}
              <div className="hidden lg:flex items-center gap-3">
                {/* Status pill */}
                <div className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
                  'border',
                  isTransparent
                    ? 'border-neutral-200/60 text-neutral-500 bg-white/40'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 bg-white/60 dark:bg-neutral-900/60'
                )}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Agents online
                </div>

                <TileCTA onClick={openCallOptions} isTransparent={isTransparent} />
              </div>

              {/* MOBILE HAMBURGER */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsMobileMenu(true)}
                className={cn(
                  'lg:hidden p-2 rounded-xl transition-colors',
                  'border',
                  isTransparent
                    ? 'border-neutral-200/40 text-neutral-900 hover:bg-black/5'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                )}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </motion.button>

            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenu(false)}
            links={navLinks}
            pathname={pathname}
          />
        )}
      </AnimatePresence>
    </>
  );
}