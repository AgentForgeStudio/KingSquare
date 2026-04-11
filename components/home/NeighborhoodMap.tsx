'use client';

import { useRef, useState, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl/mapbox';
import { MapPin, X, Layers, Satellite, Map as MapIcon, Compass } from 'lucide-react';
import { properties } from '@/data/properties';
import Link from 'next/link';
import Image from 'next/image';

type MapStyle = 'navigation-day' | 'satellite' | 'streets' | 'light';

const mapStyles: Record<MapStyle, string> = {
  'navigation-day': 'mapbox://styles/mapbox/navigation-day-v1',
  'satellite': 'mapbox://styles/mapbox/satellite-streets-v12',
  'streets': 'mapbox://styles/mapbox/streets-v12',
  'light': 'mapbox://styles/mapbox/light-v11',
};

// ── tokens (light / white background) ─────────────────────────
const gold = '#B8952A';
const goldDim = 'rgba(184,149,42,0.12)';
const goldBorder = 'rgba(184,149,42,0.35)';
const ink = '#0F0F0F';
const inkMid = 'rgba(15,15,15,0.55)';
const inkLight = 'rgba(15,15,15,0.32)';
const cardSurface = '#F7F4EE';
const borderLine = 'rgba(15,15,15,0.10)';
const displayFont = "'Cormorant Garamond','Playfair Display',Georgia,serif";
const sansFont = "'Helvetica Neue',Arial,sans-serif";

const neighborhoods = [
  {
    name: 'Lodha', city: 'Vasai', count: 124,
    image: '/lodha.png'
  },
  {
    name: 'Sunteck', city: 'Vasai', count: 87,
    image: '/sunteck/Beach/1.png'
  },  
  {
    name: 'Nakshtra', city: 'Vasai', count: 63,
    image: '/Nakshtra/agast/1.png'
  },
  {
    name: 'Navkar', city: 'Virar', count: 156,
    image: '/Navkar/city_phase/1.png'
  },
  {
    name: 'Ornate', city: 'Vasai', count: 92,
    image: '/Ornate/height/1.png'
  },
  {
    name: 'Suraksha', city: 'Virar', count: 78,
    image: '/sur.png'
  },
];

// Calculate map bounds from property coordinates
const getMapBounds = () => {
  const coords = properties
    .filter(p => p.coordinates)
    .map(p => p.coordinates!);
  
  if (coords.length === 0) return { longitude: 72.82, latitude: 19.35, zoom: 12 };
  
  const longitudes = coords.map(c => c[0]);
  const latitudes = coords.map(c => c[1]);
  
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  
  return {
    longitude: (minLng + maxLng) / 2,
    latitude: (minLat + maxLat) / 2,
    zoom: 11.5
  };
};

const MapPinIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// Letter-by-letter animated heading
function AnimatedHeading({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <span ref={ref} style={{ display: 'inline-block' }}>
      {text.split(' ').map((word, wi) => (
        <span key={wi} style={{ display: 'inline-block', marginRight: '0.22em' }}>
          {word.split('').map((ch, ci) => (
            <motion.span
              key={ci}
              style={{ display: 'inline-block' }}
              initial={{ opacity: 0, y: 22, rotateX: 40 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.5, delay: delay + wi * 0.06 + ci * 0.022, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}

// Individual card
function NeighborhoodCard({ area, index }: { area: typeof neighborhoods[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: 'relative', height: 340, overflow: 'hidden', cursor: 'pointer',
        border: `1px solid ${hovered ? goldBorder : borderLine}`,
        backgroundColor: cardSurface,
        transition: 'border-color 0.45s ease',
      }}
    >
      {/* Photo */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${area.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}
        animate={{ scale: hovered ? 1.08 : 1, opacity: hovered ? 0.82 : 0.65 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Gradient — light theme: white fade at bottom */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(247,244,238,0.97) 0%, rgba(247,244,238,0.55) 38%, transparent 100%)',
      }} />

      {/* Gold tint on hover */}
      <motion.div
        style={{ position: 'absolute', inset: 0 }}
        animate={{ backgroundColor: hovered ? goldDim : 'rgba(184,149,42,0)' }}
        transition={{ duration: 0.45 }}
      />

      {/* Index badge */}
      <motion.div
        style={{
          position: 'absolute', top: 18, right: 18,
          fontFamily: sansFont, fontSize: 10, letterSpacing: '0.18em',
          color: gold, fontWeight: 600,
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {String(index + 1).padStart(2, '0')}
      </motion.div>

      {/* Content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 26px 28px' }}>
        {/* City */}
        <motion.div
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            color: gold, fontSize: 9, letterSpacing: '0.22em',
            textTransform: 'uppercase', fontFamily: sansFont,
            fontWeight: 700, marginBottom: 8,
          }}
          animate={{ y: hovered ? 0 : 4, opacity: hovered ? 1 : 0.75 }}
          transition={{ duration: 0.35 }}
        >
          <MapPinIcon />
          {area.city}
        </motion.div>

        {/* Name */}
        <h3 style={{
          margin: '0 0 10px', fontFamily: displayFont,
          fontSize: 26, fontWeight: 400, letterSpacing: '-0.01em',
          lineHeight: 1.1, color: ink,
        }}>
          {area.name}
        </h3>

        {/* Reveal on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 7 }}
          transition={{ duration: 0.3, delay: hovered ? 0.05 : 0 }}
        >
          <div style={{ width: 24, height: 1, backgroundColor: gold, marginBottom: 8 }} />
          <p style={{
            margin: 0, fontFamily: sansFont, fontSize: 10,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: inkMid, fontWeight: 500,
          }}>
            {area.count} exclusive properties
          </p>
        </motion.div>
      </div>

      {/* Bottom gold bar */}
      <motion.div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 2, backgroundColor: gold, transformOrigin: 'left',
        }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}

// ── Interactive Map Component ─────────────────────────────────
function InteractiveMap() {
  const [selectedProperty, setSelectedProperty] = useState<typeof properties[0] | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyle>('navigation-day');
  const [showStyleSwitcher, setShowStyleSwitcher] = useState(false);
  const mapRef = useRef<any>(null);
  const mapInView = useInView(mapRef, { once: true, margin: '-100px' });
  
  const initialViewState = useMemo(() => getMapBounds(), []);
  
  const propertiesWithCoords = useMemo(() => 
    properties.filter(p => p.coordinates),
    []
  );

  return (
    <motion.div
      ref={mapRef}
      initial={{ opacity: 0, y: 40 }}
      animate={mapInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ 
        marginTop: 72, 
        borderRadius: 16, 
        overflow: 'hidden',
        border: `1px solid ${borderLine}`,
        boxShadow: '0 24px 80px rgba(0,0,0,0.08)'
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: 520 }}>
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          initialViewState={initialViewState}
          mapStyle={mapStyles[mapStyle]}
          scrollZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="top-right" />
          <FullscreenControl position="top-right" />
          {propertiesWithCoords.map((property) => (
            <Marker
              key={property.id}
              longitude={property.coordinates![0]}
              latitude={property.coordinates![1]}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedProperty(property);
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 44, height: 44, borderRadius: '50%',
                  backgroundColor: 'rgba(200,169,110,0.2)',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: '50%',
                  backgroundColor: gold, color: '#ffffff',
                  boxShadow: '0 4px 16px rgba(200,169,110,0.5)'
                }}>
                  <MapPin size={14} strokeWidth={2.5} />
                </div>
              </motion.div>
            </Marker>
          ))}

          {selectedProperty && (
            <Popup
              longitude={selectedProperty.coordinates![0]}
              latitude={selectedProperty.coordinates![1]}
              anchor="top"
              onClose={() => setSelectedProperty(null)}
              closeButton={false}
              closeOnClick={false}
              offset={[0, -10]}
            >
              <div style={{ 
                padding: 16, 
                minWidth: 280,
                backgroundColor: '#fff',
                borderRadius: 12,
                position: 'relative'
              }}>
                <button
                  onClick={() => setSelectedProperty(null)}
                  style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 24, height: 24, borderRadius: '50%',
                    border: 'none', backgroundColor: 'rgba(0,0,0,0.05)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <X size={14} />
                </button>
                
                <div style={{ position: 'relative', width: '100%', height: 120, borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
                  <Image 
                    src={selectedProperty.images[0] || '/cloud.jpeg'} 
                    alt={selectedProperty.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                
                <h4 style={{ 
                  fontFamily: displayFont, fontSize: 18, fontWeight: 600,
                  color: ink, margin: '0 0 4px'
                }}>
                  {selectedProperty.title}
                </h4>
                
                <p style={{ 
                  fontFamily: sansFont, fontSize: 11, color: inkMid,
                  margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.1em'
                }}>
                  {selectedProperty.neighborhood}, {selectedProperty.city}
                </p>
                
                <p style={{ 
                  fontFamily: sansFont, fontSize: 14, color: gold,
                  fontWeight: 600, margin: '0 0 12px'
                }}>
                  {selectedProperty.priceLabel}
                </p>
                
                <Link 
                  href={`/properties/${selectedProperty.slug}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', backgroundColor: ink,
                    color: '#fff', borderRadius: 4, fontSize: 11,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    fontWeight: 600, textDecoration: 'none',
                    fontFamily: sansFont
                  }}
                >
                  View Details
                </Link>
              </div>
            </Popup>
          )}
        </Map>

        {/* Map overlay gradient */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
          background: 'linear-gradient(to top, rgba(255,255,255,0.9) 0%, transparent 100%)',
          pointerEvents: 'none'
        }} />

        {/* Property count badge */}
        <div style={{
          position: 'absolute', top: 20, left: 20,
          padding: '12px 20px', backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: 8, backdropFilter: 'blur(10px)',
          border: `1px solid ${borderLine}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <p style={{ 
            fontFamily: sansFont, fontSize: 11, color: inkMid,
            margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.1em'
          }}>
            Properties
          </p>
          <p style={{ 
            fontFamily: displayFont, fontSize: 24, fontWeight: 600,
            color: ink, margin: 0
          }}>
            {propertiesWithCoords.length} <span style={{ color: gold }}>Locations</span>
          </p>
        </div>

        {/* Map Style Switcher Toggle */}
        <div style={{ position: 'absolute', top: 20, right: 100 }}>
          <button
            onClick={() => setShowStyleSwitcher(!showStyleSwitcher)}
            style={{
              padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: 8, backdropFilter: 'blur(10px)',
              border: `1px solid ${borderLine}`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: sansFont, fontSize: 12, fontWeight: 500,
              color: ink, transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            }}
          >
            <Layers size={16} style={{ color: gold }} /> Layers
          </button>
          
          {/* Style Options Dropdown */}
          {showStyleSwitcher && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                padding: 6, backgroundColor: 'rgba(255,255,255,0.98)',
                borderRadius: 10, backdropFilter: 'blur(10px)',
                border: `1px solid ${borderLine}`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                display: 'flex', flexDirection: 'column', gap: 4,
                minWidth: 140, zIndex: 10
              }}
            >
              <button
                onClick={() => { setMapStyle('navigation-day'); setShowStyleSwitcher(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', borderRadius: 6, border: 'none',
                  backgroundColor: mapStyle === 'navigation-day' ? goldDim : 'transparent',
                  color: mapStyle === 'navigation-day' ? ink : inkMid,
                  fontFamily: sansFont, fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                <MapIcon size={14} /> Navigation
              </button>
              <button
                onClick={() => { setMapStyle('satellite'); setShowStyleSwitcher(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', borderRadius: 6, border: 'none',
                  backgroundColor: mapStyle === 'satellite' ? goldDim : 'transparent',
                  color: mapStyle === 'satellite' ? ink : inkMid,
                  fontFamily: sansFont, fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                <Satellite size={14} /> Satellite
              </button>
              <button
                onClick={() => { setMapStyle('streets'); setShowStyleSwitcher(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', borderRadius: 6, border: 'none',
                  backgroundColor: mapStyle === 'streets' ? goldDim : 'transparent',
                  color: mapStyle === 'streets' ? ink : inkMid,
                  fontFamily: sansFont, fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                <Compass size={14} /> Streets
              </button>
              <button
                onClick={() => { setMapStyle('light'); setShowStyleSwitcher(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', borderRadius: 6, border: 'none',
                  backgroundColor: mapStyle === 'light' ? goldDim : 'transparent',
                  color: mapStyle === 'light' ? ink : inkMid,
                  fontFamily: sansFont, fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                <Layers size={14} /> Light
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main export ─────────────────────────────────────────────────
export function NeighborhoodMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '120px 0 140px',
        backgroundColor: '#FFFFFF',
        borderTop: `1px solid ${borderLine}`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Subtle warm glow */}
      <div style={{
        position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 400, pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(184,149,42,0.05) 0%, transparent 70%)',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 72 }}>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6 }}
            style={{ width: 36, height: 1, backgroundColor: gold, transformOrigin: 'left', marginBottom: 18 }}
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.1 }}
            style={{
              fontFamily: sansFont, fontSize: 9, letterSpacing: '0.28em',
              textTransform: 'uppercase', color: gold, margin: '0 0 20px', fontWeight: 700,
            }}
          >
            Prime Locations
          </motion.p>

          <h2 style={{
            fontFamily: displayFont,
            fontSize: 'clamp(42px,6vw,74px)',
            fontWeight: 300, letterSpacing: '-0.025em', lineHeight: 1.05,
            color: ink, margin: '0 0 26px',
          }}>
            <AnimatedHeading text="Explore" delay={0.15} />
            {' '}
            <span style={{ fontStyle: 'italic', color: gold }}>
              <AnimatedHeading text="Neighborhoods" delay={0.28} />
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.52 }}
            style={{
              fontFamily: sansFont, fontSize: 14, lineHeight: 1.75,
              color: inkMid, maxWidth: 420, margin: 0, fontWeight: 300,
            }}
          >
            Discover luxury living in the world's most coveted addresses — curated for the discerning few.
          </motion.p>
        </div>

        {/* ── Interactive Map ── */}
        <InteractiveMap />

        {/* ── Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: 20,
          marginTop: 48,
        }}>
          {neighborhoods.map((area, i) => (
            <NeighborhoodCard key={`${area.name}-${i}`} area={area} index={i} />
          ))}
        </div>

        {/* ── Footer rule ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          style={{
            marginTop: 64, height: 1,
            background: `linear-gradient(90deg, ${gold}, transparent)`,
            transformOrigin: 'left',
          }}
        />
      </div>
    </section>
  );
}

export default NeighborhoodMap;