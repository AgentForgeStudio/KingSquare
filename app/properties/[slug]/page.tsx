'use client';

import { use, useRef, useState } from 'react';
import { properties } from '@/data/properties';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { MapPin, Bed, Bath, Square, ChevronLeft, ArrowRight, Check, Calendar, Car, ExternalLink, Layers, Satellite, Map as MapIcon, Compass, X } from 'lucide-react';
import { useCallStore } from '@/store/callStore';
import Map, { Marker, NavigationControl, FullscreenControl } from 'react-map-gl/mapbox';

type MapStyle = 'navigation-day' | 'satellite' | 'streets' | 'light';

const mapStyles: Record<MapStyle, string> = {
  'navigation-day': 'mapbox://styles/mapbox/navigation-day-v1',
  'satellite': 'mapbox://styles/mapbox/satellite-streets-v12',
  'streets': 'mapbox://styles/mapbox/streets-v12',
  'light': 'mapbox://styles/mapbox/light-v11',
};


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
  const [mapStyle, setMapStyle] = useState<MapStyle>('navigation-day');
  const [showAddressOverlay, setShowAddressOverlay] = useState(true);

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
        @keyframes mapPulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: '#0a0a0a', margin: 0 }}>Location</h3>
                      
                      {/* Map Style Switcher - Responsive */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 6, 
                        padding: 5, 
                        backgroundColor: '#f5f5f5', 
                        borderRadius: 10,
                        flexWrap: 'wrap',
                        width: 'fit-content',
                        maxWidth: '100%'
                      }}>
                        <button
                          onClick={() => setMapStyle('navigation-day')}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '7px 12px', borderRadius: 7, border: 'none',
                            backgroundColor: mapStyle === 'navigation-day' ? '#fff' : 'transparent',
                            color: mapStyle === 'navigation-day' ? '#0a0a0a' : '#666',
                            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500,
                            cursor: 'pointer', boxShadow: mapStyle === 'navigation-day' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <MapIcon size={13} /> Navigation
                        </button>
                        <button
                          onClick={() => setMapStyle('satellite')}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '7px 12px', borderRadius: 7, border: 'none',
                            backgroundColor: mapStyle === 'satellite' ? '#fff' : 'transparent',
                            color: mapStyle === 'satellite' ? '#0a0a0a' : '#666',
                            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500,
                            cursor: 'pointer', boxShadow: mapStyle === 'satellite' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <Satellite size={13} /> Satellite
                        </button>
                        <button
                          onClick={() => setMapStyle('streets')}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '7px 12px', borderRadius: 7, border: 'none',
                            backgroundColor: mapStyle === 'streets' ? '#fff' : 'transparent',
                            color: mapStyle === 'streets' ? '#0a0a0a' : '#666',
                            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500,
                            cursor: 'pointer', boxShadow: mapStyle === 'streets' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <Compass size={13} /> Streets
                        </button>
                        <button
                          onClick={() => setMapStyle('light')}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '7px 12px', borderRadius: 7, border: 'none',
                            backgroundColor: mapStyle === 'light' ? '#fff' : 'transparent',
                            color: mapStyle === 'light' ? '#0a0a0a' : '#666',
                            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500,
                            cursor: 'pointer', boxShadow: mapStyle === 'light' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <Layers size={13} /> Light
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ 
                      position: 'relative', width: '100%', height: 'clamp(350px, 50vw, 500px)', borderRadius: 16, 
                      overflow: 'hidden', backgroundColor: '#f8f8f8', 
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
                    }}>
                      <Map
                        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                        initialViewState={{
                          longitude: property.coordinates[0],
                          latitude: property.coordinates[1],
                          zoom: 15
                        }}
                        mapStyle={mapStyles[mapStyle]}
                        scrollZoom={true}
                        style={{ width: '100%', height: '100%' }}
                      >
                        <NavigationControl position="top-right" />
                        <FullscreenControl position="top-right" />
                        
                        <Marker 
                          longitude={property.coordinates[0]} 
                          latitude={property.coordinates[1]} 
                          anchor="bottom"
                          onClick={() => setShowAddressOverlay(true)}
                        >
                          <motion.div
                            initial={{ scale: 0, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
                            style={{
                              display: 'flex', flexDirection: 'column', alignItems: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            {/* Property card above marker */}
                            <div style={{
                              backgroundColor: '#0a0a0a', color: '#fff',
                              padding: '10px 16px', borderRadius: 8,
                              marginBottom: 8, whiteSpace: 'nowrap',
                              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                              boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
                            }}>
                              {property.title}
                            </div>
                            
                            {/* Pulsing marker */}
                            <div style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              width: 64, height: 64, borderRadius: '50%', 
                              backgroundColor: 'rgba(200,169,110,0.2)',
                            }}>
                              <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 40, height: 40, borderRadius: '50%', 
                                backgroundColor: '#c8a96e', color: '#ffffff',
                                boxShadow: '0 8px 32px rgba(200,169,110,0.5)',
                                border: '3px solid #fff'
                              }}>
                                <MapPin size={18} strokeWidth={2.5} />
                              </div>
                            </div>
                            
                            {/* Pulse animation ring */}
                            <div style={{
                              position: 'absolute', bottom: 0,
                              width: 64, height: 64, borderRadius: '50%',
                              border: '2px solid rgba(200,169,110,0.4)',
                              animation: 'mapPulse 2s ease-out infinite'
                            }} />
                          </motion.div>
                        </Marker>
                      </Map>
                      
                      {/* Address overlay & Directions - Responsive */}
                      {showAddressOverlay && (
                        <div style={{
                          position: 'absolute', bottom: 16, left: 16, right: 16,
                          display: 'flex', flexDirection: 'column', gap: 12,
                          alignItems: 'stretch'
                        }}>
                          <div style={{
                            padding: '14px 18px', backgroundColor: 'rgba(255,255,255,0.95)',
                            borderRadius: 12, backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(0,0,0,0.06)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            flex: 1,
                            position: 'relative'
                          }}>
                            {/* Close button */}
                            <button
                              onClick={() => setShowAddressOverlay(false)}
                              style={{
                                position: 'absolute', top: 8, right: 8,
                                width: 24, height: 24, borderRadius: '50%',
                                border: 'none', backgroundColor: 'rgba(0,0,0,0.05)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
                              }}
                            >
                              <X size={14} />
                            </button>
                            
                            <p style={{ 
                              fontFamily: "'DM Sans', sans-serif", fontSize: 12, 
                              color: '#666', margin: '0 0 4px', textTransform: 'uppercase',
                              letterSpacing: '0.08em', fontWeight: 500
                            }}>
                              Exact Location
                            </p>
                            <p style={{ 
                              fontFamily: "'Playfair Display', Georgia, serif", 
                              fontSize: 15, color: '#0a0a0a', margin: 0, fontWeight: 600,
                              lineHeight: 1.4,
                              paddingRight: 20
                            }}>
                              {property.address}
                            </p>
                          </div>
                          
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${property.coordinates[1]},${property.coordinates[0]}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ 
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                              padding: '14px 22px', backgroundColor: '#c8a96e', 
                              color: '#ffffff', borderRadius: 10,
                              fontFamily: "'DM Sans', sans-serif", fontSize: 11, 
                              letterSpacing: '0.12em', 
                              textTransform: 'uppercase', fontWeight: 600, 
                              boxShadow: '0 8px 24px rgba(200,169,110,0.4)',
                              transition: 'all 0.2s', textDecoration: 'none',
                              whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#b89a5a';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#c8a96e';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <ExternalLink size={14} /> Get Directions
                          </a>
                        </div>
                      )}
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