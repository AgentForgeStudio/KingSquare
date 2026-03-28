'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useCallStore } from '@/store/callStore';

const footerLinks = {
  properties: [
    { href: '/properties', label: 'All Properties' },
    { href: '/properties?status=for-sale', label: 'For Sale' },
    { href: '/properties?status=for-rent', label: 'For Rent' },
    { href: '/properties?featured=true', label: 'Featured' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
    { href: '/contact#faq', label: 'FAQ' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
  ],
};

const socialLinks = [
  { href: 'https://instagram.com', icon: 'Instagram', label: 'Instagram' },
  { href: 'https://twitter.com', icon: 'Twitter', label: 'Twitter' },
  { href: 'https://facebook.com', icon: 'Facebook', label: 'Facebook' },
  { href: 'https://linkedin.com', icon: 'Linkedin', label: 'LinkedIn' },
];

export function Footer() {
  const openCallOptions = useCallStore((state) => state.openCallOptions);
  const openScheduleModal = useCallStore((state) => state.openScheduleModal);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold font-serif tracking-tight">LUXE ESTATES</span>
            </Link>
            <p className="text-neutral-400 mb-6 max-w-sm leading-relaxed">
              Discover extraordinary properties with LUXE Estates. Your trusted partner in finding luxury homes that match your lifestyle.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-amber-500 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <span className="text-xs font-bold">{social.icon.charAt(0)}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Properties</h4>
            <ul className="space-y-3">
              {footerLinks.properties.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-neutral-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>hello@luxeestates.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 mt-1" />
                <span>123 Luxury Lane, Bandra West, Mumbai 400050</span>
              </li>
            </ul>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => openCallOptions()}
                className="w-full px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-medium transition-colors text-sm"
              >
                Talk to Agent
              </button>
              <button
                onClick={() => openScheduleModal()}
                className="w-full px-4 py-2.5 border border-neutral-700 hover:border-amber-500 rounded-lg font-medium transition-colors text-sm"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} LUXE Estates. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-neutral-500 hover:text-white text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-amber-500 hover:bg-amber-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-40"
        aria-label="Scroll to top"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </footer>
  );
}
