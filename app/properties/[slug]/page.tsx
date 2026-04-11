'use client';

import { use, useRef } from 'react';
import { properties } from '@/data/properties';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { MapPin, Bed, Bath, Square, ChevronLeft, ArrowRight, Check, Calendar, Car, ExternalLink } from 'lucide-react';
import { useCallStore } from '@/store/callStore';
import Map, { Marker } from 'react-map-gl/mapbox';


const EASE = [0.22, 1, 0.36, 1] as const;

export default function PropertyDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const property = properties.find((p) => p.slug === params.slug);

  if (!property) return notFound();

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  
  // Progress bar
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Hero parallax
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const openScheduleModal = useCallStore((s) => s.openScheduleModal);
  const openCallOptions = useCallStore((s) => s.openCallOptions);

  const images = property.images && property.images.length > 0 ? property.images : ['/cloud.jpeg'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { background: #ffffff; color: #0a0a0a; }
        a { text-decoration: none; color: inherit; }
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 24px 64px -16px rgba(0,0,0,0.06);
        }
      `}</style>

      {/* Top progress bar */}
      <motion.div
        style={{ scaleX, transformOrigin: '0%', position: 'fixed', top: 0, left: 0, right: 0, height: 4, background: '#c8a96e', zIndex: 100 }}
      />

      <main ref={containerRef} style={{ backgroundColor: '#ffffff', minHeight: '100vh', position: 'relative' }}>
        
        {/* Back Link */}
        <div style={{ position: 'absolute', top: 120, left: 40, zIndex: 50 }}>
          <Link href="/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.4)', transition: 'opacity 0.2s' }}>
            <ChevronLeft size={16} /> Back to Portfolio
          </Link>
        </div>

        {/* ── Immersive Hero ── */}
        <section style={{ position: 'relative', width: '100vw', height: '80vh', overflow: 'hidden', minHeight: 600 }}>
          <motion.div style={{ y: heroY, opacity: heroOpacity, position: 'absolute', inset: 0 }}>
            <Image
              src={images[0]}
              alt={property.title}
              fill
              className="object-cover"
              priority
              quality={100}
            />
            {/* Soft gradient bottom to blend into white */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 30%, rgba(255,255,255,0) 70%, #ffffff 100%)' }} />
          </motion.div>
        </section>

        {/* ── Content Grid ── */}
        <section style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 10, marginTop: -140 }}>
          <div style={{ display: 'flex', gap: 64, flexDirection: 'row', flexWrap: 'wrap' }}>
            
            {/* Left: Main Details */}
            <div style={{ flex: '1 1 600px' }}>
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
                
                {/* Status & Type */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                  <span style={{ padding: '6px 14px', backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
                    {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                  </span>
                  <span style={{ padding: '6px 14px', backgroundColor: 'rgba(0,0,0,0.05)', color: '#0a0a0a', fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
                    {property.type}
                  </span>
                </div>

                <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em', color: '#0a0a0a', marginBottom: 24 }}>
                  {property.title}
                </h1>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#888880', fontFamily: "'DM Sans', sans-serif", fontSize: 14, letterSpacing: '0.04em', marginBottom: 64 }}>
                  <MapPin size={18} />
                  <span>{property.address || `${property.neighborhood}, ${property.city}`}</span>
                </div>

                {/* Key Metrics */}
                <div style={{ display: 'flex', gap: 40, padding: '40px 0', borderTop: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)', marginBottom: 64, flexWrap: 'wrap' }}>
                  {[
                    { icon: <Bed size={20} />, label: 'Bedrooms', val: property.beds },
                    { icon: <Bath size={20} />, label: 'Bathrooms', val: property.baths },
                    { icon: <Square size={20} />, label: 'Area', val: `${(property.sqft || 0).toLocaleString()} sqft` },
                    { icon: <Car size={20} />, label: 'Parking', val: property.parking || '-' },
                  ].map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                      <div style={{ color: '#c8a96e', marginTop: 2 }}>{m.icon}</div>
                      <div>
                        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, lineHeight: 1, color: '#0a0a0a', margin: '0 0 6px' }}>{m.val}</p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888880', margin: 0, fontWeight: 500 }}>{m.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: '#0a0a0a', marginBottom: 24 }}>About this property</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.8, color: '#4a4a4a', fontWeight: 300, marginBottom: 64, whiteSpace: 'pre-line' }}>
                  {property.description}
                </p>

                {/* Features & Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div style={{ marginBottom: 80 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: '#0a0a0a', marginBottom: 32 }}>Features & Amenities</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
                      {property.amenities.map((amenity, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', backgroundColor: 'rgba(200,169,110,0.1)', color: '#c8a96e' }}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#0a0a0a', fontWeight: 400 }}>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Map */}
                {property.coordinates && (
                  <div style={{ marginBottom: 80 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: '#0a0a0a', marginBottom: 32 }}>Location</h3>
                    <div style={{ position: 'relative', width: '100%', height: 440, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fcfcfc', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <Map
                        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                        initialViewState={{
                          longitude: property.coordinates[0],
                          latitude: property.coordinates[1],
                          zoom: 14.5
                        }}
                        mapStyle="mapbox://styles/mapbox/light-v11"
                        scrollZoom={false}
                      >
                        <Marker longitude={property.coordinates[0]} latitude={property.coordinates[1]} anchor="bottom">
                          <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 56, height: 56, borderRadius: '50%', backgroundColor: 'rgba(200,169,110,0.15)',
                            animation: 'pulse 2s infinite'
                          }}>
                            <div style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              width: 32, height: 32, borderRadius: '50%', backgroundColor: '#c8a96e', color: '#ffffff',
                              boxShadow: '0 8px 24px rgba(200,169,110,0.4)'
                            }}>
                              <MapPin size={16} strokeWidth={2.5} />
                            </div>
                          </div>
                        </Marker>
                      </Map>
                      
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${property.coordinates[1]},${property.coordinates[0]}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ 
                          position: 'absolute', bottom: 20, right: 20, display: 'flex', alignItems: 'center', gap: 8,
                          padding: '12px 18px', backgroundColor: '#0a0a0a', color: '#ffffff', borderRadius: 4,
                          fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.14em', 
                          textTransform: 'uppercase', fontWeight: 600, boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                          transition: 'all 0.2s', textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0a0a0a'}
                      >
                        Get Directions <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                )}

                {/* Image Gallery */}
                {images.length > 1 && (
                  <div style={{ marginBottom: 120 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: '#0a0a0a', marginBottom: 32 }}>Gallery</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                      {images.slice(1).map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 4, overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
                          <Image src={img} alt={`${property.title} gallery ${idx + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </motion.div>
            </div>

            {/* Right: Sticky Glass Panel */}
            <div style={{ flex: '1 1 360px', maxWidth: 420 }}>
              <div style={{ position: 'sticky', top: 120, paddingBottom: 60 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                  className="glass-card"
                  style={{ padding: 40, borderRadius: 16 }}
                >
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888880', fontWeight: 600, marginBottom: 8 }}>
                    Current Value
                  </p>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 44, fontWeight: 700, color: '#c8a96e', lineHeight: 1, marginBottom: 32 }}>
                    {property.priceLabel || `₹${(property.price || 0).toLocaleString()}`}
                  </h2>

                  {/* Agent block */}
                  {property.agent && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <div style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', backgroundColor: '#eaeaea' }}>
                        <Image src={property.agent.photo || '/cloud.jpeg'} alt={property.agent.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b8b5ae', margin: '0 0 4px', fontWeight: 600 }}>Listed By</p>
                        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: '#0a0a0a', margin: 0 }}>{property.agent.name}</p>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <button onClick={() => openScheduleModal(property.title)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '16px', backgroundColor: '#0a0a0a', color: '#ffffff', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, transition: 'all 0.2s', borderRadius: 4 }}>
                      <Calendar size={16} /> Schedule a Tour
                    </button>
                    <button onClick={() => openCallOptions()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '16px', backgroundColor: 'transparent', color: '#0a0a0a', border: '1px solid #0a0a0a', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, transition: 'all 0.2s', borderRadius: 4 }}>
                      Contact Executive
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}