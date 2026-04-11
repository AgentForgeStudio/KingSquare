'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bed, Bath, Square, Search, SlidersHorizontal, X, ArrowRight, ChevronDown } from 'lucide-react';

// ─── Easing ────────────────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Variants ──────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.85, delay, ease: EASE },
  }),
};
const fadeLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: (delay = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.75, delay, ease: EASE },
  }),
};
const lineGrow = {
  hidden: { scaleX: 0 },
  visible: (delay = 0) => ({
    scaleX: 1,
    transition: { duration: 0.7, delay, ease: EASE },
  }),
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────
import { properties as dataProperties } from '@/data/properties';

const PROPERTIES = dataProperties.map(p => ({
  ...p,
  image: p.images?.[0] || '/cloud.jpeg',
  type: p.type.charAt(0).toUpperCase() + p.type.slice(1),
}));

const TYPES   = ['All', 'Apartment', 'Villa', 'Penthouse', 'Estate', 'Townhouse'];
const STATUSES = ['All', 'For Sale', 'For Rent'];
const SORT_OPTIONS = ['Default', 'Price: Low to High', 'Price: High to Low', 'Newest'];

// ─── Property Card ─────────────────────────────────────────────────────────────
function PropertyCard({ property, index }: { property: typeof PROPERTIES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      custom={index * 0.07}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={fadeUp}
    >
      <Link href={`/properties/${property.slug}`} className="block group">
        <div
          className="relative overflow-hidden bg-neutral-100"
          style={{ aspectRatio: '4/3' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Image */}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <Image
              src={property.image}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </motion.div>

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {property.featured && (
              <span style={{
                padding: '4px 10px',
                backgroundColor: '#c8a96e',
                color: '#fafaf8',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 9, letterSpacing: '0.14em',
                textTransform: 'uppercase', fontWeight: 600,
              }}>
                Featured
              </span>
            )}
            <span style={{
              padding: '4px 10px',
              backgroundColor: property.status === 'for-sale' ? 'rgba(16,185,129,0.9)' : 'rgba(59,130,246,0.9)',
              color: '#fff',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9, letterSpacing: '0.14em',
              textTransform: 'uppercase', fontWeight: 600,
            }}>
              {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
            </span>
          </div>

          {/* Hover CTA */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="absolute bottom-4 right-4"
              >
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px',
                  backgroundColor: '#fafaf8',
                  color: '#0a0a0a',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10, letterSpacing: '0.12em',
                  textTransform: 'uppercase', fontWeight: 600,
                }}>
                  View
                  <ArrowRight size={12} />
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Price on image */}
          <div className="absolute bottom-4 left-4">
            <p style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 22, fontWeight: 700, color: '#fafaf8',
              lineHeight: 1, letterSpacing: '-0.01em',
            }}>
              {property.priceLabel}
            </p>
          </div>
        </div>

        {/* Card body */}
        <div className="pt-4 pb-5">
          {/* Accent line */}
          <div className="relative h-px bg-neutral-200 mb-4 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[#c8a96e]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: hovered ? 1 : 0.3 }}
              viewport={{ once: true }}
              animate={{ scaleX: hovered ? 1 : 0.3 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ transformOrigin: 'left', width: '100%' }}
            />
          </div>

          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 18, fontWeight: 700,
              color: hovered ? '#c8a96e' : '#0a0a0a',
              lineHeight: 1.2, letterSpacing: '-0.01em',
              transition: 'color 0.3s',
            }}>
              {property.title}
            </h3>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#b8b5ae',
              fontWeight: 500, flexShrink: 0, paddingTop: 3,
            }}>
              {property.type}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mb-3" style={{ color: '#888880' }}>
            <MapPin size={11} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.08em' }}>
              {property.neighborhood}, {property.city}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-3" style={{ color: '#888880' }}>
            {[
              { icon: <Bed size={12} />, val: `${property.beds} Bed` },
              { icon: <Bath size={12} />, val: `${property.baths} Bath` },
              { icon: <Square size={12} />, val: `${property.sqft.toLocaleString()} sq ft` },
            ].map((s, i) => (
              <span key={i} className="flex items-center gap-1" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.06em' }}>
                {s.icon} {s.val}
              </span>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {property.tags.map((tag) => (
              <span key={tag} style={{
                padding: '3px 9px',
                border: '1px solid rgba(10,10,10,0.1)',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 9, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#888880',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Featured Hero Card ────────────────────────────────────────────────────────
function FeaturedCard({ property }: { property: typeof PROPERTIES[0] }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true }}
      variants={fadeUp} custom={0}
      className="col-span-full"
    >
      <Link href={`/properties/${property.slug}`} className="block">
        <div
          className="relative overflow-hidden"
          style={{ height: 'clamp(320px, 45vw, 520px)' }}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ scale: hov ? 1.04 : 1 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <Image
              src={property.image} alt={property.title}
              fill className="object-cover"
              sizes="100vw" priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <div className="flex gap-2 mb-4">
              <span style={{ padding: '4px 12px', backgroundColor: '#c8a96e', color: '#fafaf8', fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}>
                Featured
              </span>
              <span style={{ padding: '4px 12px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
                {property.type}
              </span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, color: '#fafaf8', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 10 }}>
              {property.title}
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: 300, marginBottom: 20, maxWidth: 420 }}>
              {property.description}
            </p>
            <div className="flex items-center justify-between">
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: '#c8a96e', lineHeight: 1 }}>
                {property.priceLabel}
              </p>
              <motion.span
                animate={{ x: hov ? 0 : -8, opacity: hov ? 1 : 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', backgroundColor: '#fafaf8', color: '#0a0a0a', fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}
              >
                View Property <ArrowRight size={12} />
              </motion.span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Filter Bar ────────────────────────────────────────────────────────────────
function FilterBar({
  search, setSearch,
  type, setType,
  status, setStatus,
  sort, setSort,
  resultCount,
  filtersOpen, setFiltersOpen,
}: {
  search: string; setSearch: (v: string) => void;
  type: string; setType: (v: string) => void;
  status: string; setStatus: (v: string) => void;
  sort: string; setSort: (v: string) => void;
  resultCount: number;
  filtersOpen: boolean; setFiltersOpen: (v: boolean) => void;
}) {
  return (
    <div>
      {/* Main search row */}
      <div className="flex gap-0" style={{ border: '1px solid rgba(10,10,10,0.12)', backgroundColor: '#fafaf8' }}>
        {/* Search input */}
        <div className="flex items-center gap-3 flex-1 px-4 py-3" style={{ borderRight: '1px solid rgba(10,10,10,0.10)' }}>
          <Search size={14} style={{ color: '#b8b5ae', flexShrink: 0 }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, neighbourhood, city…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300,
              color: '#0a0a0a', caretColor: '#c8a96e',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b8b5ae', display: 'flex' }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 20px', background: filtersOpen ? '#0a0a0a' : 'none',
            border: 'none', cursor: 'pointer', transition: 'all 0.25s',
            fontFamily: "'DM Sans', sans-serif", fontSize: 10,
            letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600,
            color: filtersOpen ? '#fafaf8' : '#888880',
          }}
        >
          <SlidersHorizontal size={13} />
          Filters
        </button>
      </div>

      {/* Expanded filters */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 0,
              border: '1px solid rgba(10,10,10,0.12)',
              borderTop: 'none',
              backgroundColor: '#f3f1ed',
            }}>
              {/* Type */}
              <div style={{ padding: '16px 20px', borderRight: '1px solid rgba(10,10,10,0.08)' }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b8b5ae', marginBottom: 10, fontWeight: 600 }}>Type</p>
                <div className="flex flex-wrap gap-1.5">
                  {TYPES.map((t) => (
                    <button key={t} onClick={() => setType(t)} style={{
                      padding: '4px 10px',
                      border: `1px solid ${type === t ? 'rgba(200,169,110,0.5)' : 'rgba(10,10,10,0.10)'}`,
                      backgroundColor: type === t ? 'rgba(200,169,110,0.12)' : 'rgba(0,0,0,0)',
                      color: type === t ? '#c8a96e' : '#888880',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.08em',
                      cursor: 'pointer', transition: 'all 0.2s', fontWeight: type === t ? 600 : 400,
                    }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div style={{ padding: '16px 20px', borderRight: '1px solid rgba(10,10,10,0.08)' }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b8b5ae', marginBottom: 10, fontWeight: 600 }}>Status</p>
                <div className="flex flex-wrap gap-1.5">
                  {STATUSES.map((s) => (
                    <button key={s} onClick={() => setStatus(s)} style={{
                      padding: '4px 10px',
                      border: `1px solid ${status === s ? 'rgba(200,169,110,0.5)' : 'rgba(10,10,10,0.10)'}`,
                      backgroundColor: status === s ? 'rgba(200,169,110,0.12)' : 'rgba(0,0,0,0)',
                      color: status === s ? '#c8a96e' : '#888880',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.08em',
                      cursor: 'pointer', transition: 'all 0.2s', fontWeight: status === s ? 600 : 400,
                    }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div style={{ padding: '16px 20px' }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b8b5ae', marginBottom: 10, fontWeight: 600 }}>Sort By</p>
                <div className="relative" style={{ display: 'inline-block' }}>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    style={{
                      appearance: 'none', padding: '6px 28px 6px 10px',
                      border: '1px solid rgba(10,10,10,0.12)',
                      backgroundColor: '#fafaf8', color: '#0a0a0a',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                      outline: 'none', cursor: 'pointer',
                    }}
                  >
                    {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#888880', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result count */}
      <div className="flex items-center justify-between mt-4">
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#b8b5ae', letterSpacing: '0.06em' }}>
          Showing <strong style={{ color: '#0a0a0a' }}>{resultCount}</strong> properties
        </p>
        {(search || type !== 'All' || status !== 'All') && (
          <button
            onClick={() => { setSearch(''); setType('All'); setStatus('All'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a96e' }}
          >
            <X size={11} /> Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function PropertiesPage() {
  const [search, setSearch]           = useState('');
  const [type, setType]               = useState('All');
  const [status, setStatus]           = useState('All');
  const [sort, setSort]               = useState('Default');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: headerRef, offset: ['start start', 'end start'] });
  const wmY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...PROPERTIES];
    if (search)       list = list.filter((p) => [p.title, p.neighborhood, p.city, p.type].join(' ').toLowerCase().includes(search.toLowerCase()));
    if (type !== 'All')   list = list.filter((p) => p.type === type);
    if (status !== 'All') list = list.filter((p) => status === 'For Sale' ? p.status === 'for-sale' : p.status === 'for-rent');
    if (sort === 'Price: Low to High') list.sort((a, b) => a.price - b.price);
    if (sort === 'Price: High to Low') list.sort((a, b) => b.price - a.price);
    return list;
  }, [search, type, status, sort]);

  const featured = filtered.find((p) => p.featured) || null;
  const rest     = filtered.filter((p) => !p.featured || filtered.indexOf(p) > 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { background: #fafaf8; }
        ::placeholder { color: #b8b5ae; }
        a { text-decoration: none; color: inherit; }
      `}</style>

      <main style={{ backgroundColor: '#fafaf8', minHeight: '100vh' }}>

        {/* ── Hero Header ── */}
        <header ref={headerRef} style={{ position: 'relative', overflow: 'hidden', height: '60vh', minHeight: 480, display: 'flex', alignItems: 'flex-end', paddingBottom: 64 }}>

          {/* Parallax Building Image */}
          <motion.div
            style={{ y: wmY, position: 'absolute', inset: '-10%', zIndex: 0 }}
          >
            <Image 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
              alt="KingSquare Properties Portfolio"
              fill
              className="object-cover"
              priority
            />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.1) 100%)' }} />
          </motion.div>

          <div style={{ maxWidth: 1280, width: '100%', margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyItems: 'space-between', flexDirection: 'row', flexWrap: 'wrap', gap: 32, justifyContent: 'space-between' }}>

              <div>
                {/* Label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <motion.span
                    custom={0} initial="hidden" animate="visible" variants={fadeLeft}
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}
                  >
                    Our Portfolio
                  </motion.span>
                  <motion.div
                    custom={0.1} initial="hidden" animate="visible" variants={lineGrow}
                    style={{ height: 1, width: 48, backgroundColor: '#c8a96e', transformOrigin: 'left' }}
                  />
                </div>

                {/* Heading */}
                <motion.h1
                  custom={0.15} initial="hidden" animate="visible" variants={fadeUp}
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.025em', color: '#ffffff', margin: 0 }}
                >
                  Curated
                  <br />
                  <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>Properties</em>
                </motion.h1>
              </div>

              <motion.p
                custom={0.3} initial="hidden" animate="visible" variants={fadeUp}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, maxWidth: 320, paddingBottom: 16 }}
              >
                An exclusive selection of luxury homes, villas, and investment properties across India's most coveted addresses.
              </motion.p>
            </div>

            {/* Stats row */}
            <motion.div
              custom={0.4} initial="hidden" animate="visible" variants={fadeUp}
              style={{ display: 'flex', gap: 0, marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 24 }}
            >
              {[
                { n: PROPERTIES.length, label: 'Listings' },
                { n: PROPERTIES.filter((p) => p.status === 'for-sale').length, label: 'For Sale' },
                { n: PROPERTIES.filter((p) => p.status === 'for-rent').length, label: 'For Rent' },
                { n: PROPERTIES.filter((p) => p.featured).length, label: 'Featured' },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, paddingRight: 24, borderRight: i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none', paddingLeft: i > 0 ? 24 : 0 }}>
                  <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: '#ffffff', lineHeight: 1, margin: '0 0 4px' }}>{s.n}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', margin: 0, fontWeight: 600 }}>{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </header>

        {/* ── Content ── */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px 120px' }}>

          {/* Filter bar */}
          <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ marginBottom: 48 }}>
            <FilterBar
              search={search} setSearch={setSearch}
              type={type} setType={setType}
              status={status} setStatus={setStatus}
              sort={sort} setSort={setSort}
              resultCount={filtered.length}
              filtersOpen={filtersOpen} setFiltersOpen={setFiltersOpen}
            />
          </motion.div>

          {/* No results */}
          <AnimatePresence mode="wait">
            {filtered.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{ textAlign: 'center', padding: '80px 0' }}
              >
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontStyle: 'italic', color: '#b8b5ae', marginBottom: 12 }}>
                  No properties found
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#b8b5ae', marginBottom: 24 }}>
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => { setSearch(''); setType('All'); setStatus('All'); }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', border: '1px solid rgba(10,10,10,0.15)', backgroundColor: 'rgba(0,0,0,0)', color: '#0a0a0a', fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer' }}
                >
                  Clear all filters
                </button>
              </motion.div>
            )}

            {filtered.length > 0 && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>

                {/* Featured hero (first featured property) */}
                {featured && (
                  <div style={{ marginBottom: 48 }}>
                    <FeaturedCard property={featured} />
                  </div>
                )}

                {/* Property grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '48px 32px' }}>
                  {rest.map((p, i) => (
                    <PropertyCard key={p.id} property={p} index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom CTA */}
          {filtered.length > 0 && (
            <motion.div
              custom={0.2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ marginTop: 80, paddingTop: 40, borderTop: '1px solid rgba(10,10,10,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}
            >
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: 16, color: '#b8b5ae' }}>
                Can't find what you're looking for?
              </p>
              <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, color: '#0a0a0a' }}>
                Talk to an Executive
                <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, border: '1px solid #0a0a0a', overflow: 'hidden' }}>
                  <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}