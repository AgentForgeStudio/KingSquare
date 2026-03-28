'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, Phone, MapPin, Info, FileText, Mail } from 'lucide-react';
import { useCallStore } from '@/store/callStore';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: Array<{ href: string; label: string }>;
  pathname: string;
}

const bottomLinks = [
  { href: '/contact', label: 'Send Enquiry', icon: Mail },
  { href: '/contact', label: 'Visit Office', icon: MapPin },
];

export function MobileMenu({ isOpen, onClose, links, pathname }: MobileMenuProps) {
  const openCallOptions = useCallStore((state) => state.openCallOptions);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] lg:hidden"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-950 shadow-2xl"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-xl font-bold font-serif">LUXE ESTATES</span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-6">
            <div className="space-y-1">
              {links.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
              <p className="px-4 text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                Quick Actions
              </p>
              <div className="space-y-1">
                {bottomLinks.map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </nav>

          <div className="p-6 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => {
                onClose();
                openCallOptions();
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-medium transition-all hover:bg-neutral-800 dark:hover:bg-neutral-100"
            >
              <Phone className="w-5 h-5" />
              Talk to Agent
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
