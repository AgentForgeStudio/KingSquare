'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { useCallStore } from '@/store/callStore';
import { isTouchDevice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { MobileMenu } from './MobileMenu';

const navLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const openCallOptions = useCallStore((state) => state.openCallOptions);
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isHomePage = pathname === '/';

  return (
    <>
      <nav
        ref={navbarRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled || !isHomePage
            ? 'bg-white/90 dark:bg-neutral-950/90 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-800 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <span
                className={cn(
                  'text-2xl font-bold tracking-tight font-serif',
                  isScrolled || !isHomePage ? 'text-neutral-900 dark:text-white' : 'text-neutral-900'
                )}
              >
                LUXE ESTATES
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  active={pathname === link.href}
                  isLight={!isScrolled && isHomePage}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => openCallOptions()}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-200',
                  'border border-neutral-300 dark:border-neutral-700',
                  'hover:bg-neutral-900 hover:border-neutral-900 dark:hover:bg-white dark:hover:text-neutral-900',
                  isScrolled || !isHomePage
                    ? 'text-neutral-900 dark:text-white'
                    : 'text-neutral-900'
                )}
              >
                <Phone className="w-4 h-4" />
                Talk to Agent
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={cn(
                'lg:hidden p-2 rounded-lg transition-colors',
                isScrolled || !isHomePage
                  ? 'text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  : 'text-neutral-900 hover:bg-neutral-100'
              )}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            links={navLinks}
            pathname={pathname}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({
  href,
  children,
  active,
  isLight,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
  isLight: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'relative py-2 text-sm font-medium transition-colors duration-200 group',
        active
          ? 'text-amber-500'
          : isLight
          ? 'text-neutral-900 hover:text-neutral-700'
          : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
      )}
    >
      {children}
      {active && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500" />
      )}
      <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-current transition-all duration-200 group-hover:w-full" />
    </Link>
  );
}
