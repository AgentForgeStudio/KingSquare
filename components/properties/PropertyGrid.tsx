'use client';

import { useEffect, useRef } from 'react';

export default function AboutPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --ink:    #0c0c0c;
          --cream:  #f5f0e8;
          --gold:   #b8995a;
          --gold-l: #d4b87a;
          --mist:   #e8e2d8;
          --warm:   #1a1510;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        body.about-page {
          background: var(--ink);
          color: var(--cream);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        /* ── REVEAL SYSTEM ── */
        .reveal {
          opacity: 0;
          transform: translateY(48px);
          transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1),
                      transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal.delay-1 { transition-delay: 0.12s; }
        .reveal.delay-2 { transition-delay: 0.24s; }
        .reveal.delay-3 { transition-delay: 0.36s; }
        .reveal.delay-4 { transition-delay: 0.48s; }
        .reveal.in-view  { opacity: 1; transform: translateY(0); }

        .reveal-left {
          opacity: 0;
          transform: translateX(-56px);
          transition: opacity 1s cubic-bezier(0.16,1,0.3,1),
                      transform 1s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal-left.in-view { opacity: 1; transform: translateX(0); }

        .reveal-right {
          opacity: 0;
          transform: translateX(56px);
          transition: opacity 1s cubic-bezier(0.16,1,0.3,1),
                      transform 1s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal-right.in-view { opacity: 1; transform: translateX(0); }

        .reveal-scale {
          opacity: 0;
          transform: scale(0.88);
          transition: opacity 1s cubic-bezier(0.16,1,0.3,1),
                      transform 1s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal-scale.in-view { opacity: 1; transform: scale(1); }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0 6vw 7vh;
          position: relative;
          overflow: hidden;
        }

        .hero-noise {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(ellipse 80% 60% at 60% 30%, rgba(184,153,90,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 50% 80% at 90% 80%, rgba(184,153,90,0.05) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        /* Thin horizontal rule that draws in */
        .hero-rule {
          width: 0;
          height: 1px;
          background: var(--gold);
          margin-bottom: 2.5rem;
          transition: width 1.4s cubic-bezier(0.16,1,0.3,1) 0.2s;
        }
        .hero-rule.in-view { width: 80px; }

        .hero-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1.6rem;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(5rem, 13vw, 13rem);
          font-weight: 300;
          line-height: 0.88;
          letter-spacing: -0.025em;
          color: var(--cream);
          position: relative;
          z-index: 1;
          margin-bottom: 3rem;
        }

        .hero-title em {
          font-style: italic;
          color: var(--gold-l);
        }

        .hero-sub-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 3rem;
          position: relative;
          z-index: 1;
        }

        .hero-mission {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 2vw, 1.5rem);
          font-weight: 300;
          font-style: italic;
          color: rgba(245,240,232,0.65);
          max-width: 480px;
          line-height: 1.7;
        }

        .hero-scroll-hint {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: rgba(245,240,232,0.35);
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .scroll-line {
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, var(--gold), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50%       { opacity: 1;   transform: scaleY(1.15); }
        }

        /* ── DIVIDER ── */
        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(184,153,90,0.3), transparent);
          margin: 0 6vw;
        }

        /* ── MANIFESTO ── */
        .manifesto {
          padding: 10rem 6vw;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 6rem;
          align-items: start;
        }

        .manifesto-label {
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          padding-top: 0.5rem;
        }

        .manifesto-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.6rem, 3.2vw, 2.8rem);
          font-weight: 300;
          line-height: 1.55;
          color: var(--cream);
        }

        .manifesto-text strong {
          font-weight: 600;
          color: #fff;
        }

        /* ── STATS ── */
        .stats-band {
          padding: 6rem 6vw;
          border-top: 1px solid rgba(184,153,90,0.15);
          border-bottom: 1px solid rgba(184,153,90,0.15);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .stat-block {
          text-align: center;
          padding: 3rem 1rem;
          position: relative;
        }

        .stat-block::after {
          content: '';
          position: absolute;
          right: 0; top: 20%; bottom: 20%;
          width: 1px;
          background: rgba(184,153,90,0.2);
        }
        .stat-block:last-child::after { display: none; }

        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 5vw, 5.5rem);
          font-weight: 300;
          color: var(--gold-l);
          line-height: 1;
          letter-spacing: -0.03em;
        }

        .stat-label {
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.45);
          margin-top: 0.8rem;
          font-weight: 400;
        }

        /* ── VALUES ── */
        .values {
          padding: 10rem 6vw;
        }

        .values-header {
          display: flex;
          align-items: baseline;
          gap: 2rem;
          margin-bottom: 5rem;
        }

        .section-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          color: var(--gold);
          font-style: italic;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 300;
          color: var(--cream);
          letter-spacing: -0.02em;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(184,153,90,0.15);
          border: 1px solid rgba(184,153,90,0.15);
        }

        .value-card {
          background: var(--ink);
          padding: 3.5rem 2.5rem;
          transition: background 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .value-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 0% 100%, rgba(184,153,90,0.07), transparent 60%);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .value-card:hover::before { opacity: 1; }
        .value-card:hover { background: #121008; }

        .value-index {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3.5rem;
          font-weight: 300;
          color: rgba(184,153,90,0.18);
          line-height: 1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.04em;
        }

        .value-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 500;
          color: var(--cream);
          margin-bottom: 1rem;
          letter-spacing: -0.01em;
        }

        .value-desc {
          font-size: 0.88rem;
          color: rgba(245,240,232,0.5);
          line-height: 1.8;
          font-weight: 300;
        }

        /* ── TEAM ── */
        .team {
          padding: 10rem 6vw;
          background: #0a0905;
        }

        .team-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 5rem;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
        }

        .team-card {
          position: relative;
        }

        .team-img-wrap {
          width: 100%;
          aspect-ratio: 3/4;
          background: #1a1510;
          margin-bottom: 1.5rem;
          overflow: hidden;
          position: relative;
        }

        .team-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .team-initials {
          font-family: 'Cormorant Garamond', serif;
          font-size: 5rem;
          font-weight: 300;
          color: rgba(184,153,90,0.3);
          letter-spacing: -0.04em;
        }

        .team-img-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,9,5,0.6) 0%, transparent 50%);
        }

        .team-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 500;
          color: var(--cream);
          letter-spacing: -0.01em;
          margin-bottom: 0.3rem;
        }

        .team-role {
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 400;
        }

        /* ── MARQUEE ── */
        .marquee-wrap {
          padding: 4rem 0;
          overflow: hidden;
          border-top: 1px solid rgba(184,153,90,0.12);
          border-bottom: 1px solid rgba(184,153,90,0.12);
        }

        .marquee-track {
          display: flex;
          gap: 4rem;
          animation: marquee 22s linear infinite;
          white-space: nowrap;
        }

        .marquee-item {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          font-weight: 300;
          font-style: italic;
          color: rgba(245,240,232,0.18);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 4rem;
        }

        .marquee-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
          opacity: 0.5;
          flex-shrink: 0;
        }

        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ── CTA ── */
        .cta-section {
          padding: 12rem 6vw;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(184,153,90,0.06), transparent 70%);
          pointer-events: none;
        }

        .cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 8vw, 8rem);
          font-weight: 300;
          color: var(--cream);
          line-height: 0.92;
          letter-spacing: -0.03em;
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
        }

        .cta-title em {
          font-style: italic;
          color: var(--gold-l);
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          background: transparent;
          border: 1px solid rgba(184,153,90,0.5);
          color: var(--gold-l);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 1.2rem 3rem;
          border-radius: 0;
          cursor: pointer;
          transition: background 0.3s, border-color 0.3s, color 0.3s;
          position: relative;
          z-index: 1;
        }

        .cta-btn:hover {
          background: var(--gold);
          border-color: var(--gold);
          color: var(--ink);
        }

        .cta-arrow {
          transition: transform 0.3s;
        }
        .cta-btn:hover .cta-arrow { transform: translateX(5px); }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .stats-band { grid-template-columns: repeat(2, 1fr); }
          .values-grid { grid-template-columns: 1fr 1fr; }
          .team-grid { grid-template-columns: 1fr 1fr; }
          .manifesto { grid-template-columns: 1fr; gap: 2rem; }
        }

        @media (max-width: 768px) {
          .hero { padding: 0 5vw 6vh; }
          .hero-sub-row { flex-direction: column; gap: 2rem; }
          .hero-scroll-hint { display: none; }
          .stats-band { grid-template-columns: 1fr 1fr; padding: 4rem 5vw; }
          .stat-block::after { display: none; }
          .values-grid { grid-template-columns: 1fr; }
          .team-grid { grid-template-columns: 1fr; }
          .values, .team, .manifesto { padding: 6rem 5vw; }
          .cta-section { padding: 8rem 5vw; }
        }
      `}</style>

      <div className="about-page">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-noise" />

          <div className="reveal hero-rule" />

          <p className="reveal delay-1 hero-eyebrow">Est. 2019 · Mumbai, India</p>

          <h1 className="reveal delay-2 hero-title">
            About<br /><em>Us</em>
          </h1>

          <div className="hero-sub-row">
            <p className="reveal delay-3 hero-mission">
              Our Mission: Moving You Forward<br />in Real Estate
            </p>
            <div className="hero-scroll-hint reveal delay-4">
              <div className="scroll-line" />
              <span>Scroll</span>
            </div>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...Array(2)].map((_, i) => (
              <div key={i} style={{ display: 'flex', color:"black", gap: '4rem', flexShrink: 0 }}>
                {['Expert Agents', 'Real Guidance', 'Premirum Properties', 'Trusted Partners', 'Seamless Process', 'Your Future Home'].map((text, j) => (
                  <span key={j} className="marquee-item">
                    {text}
                    <span className="marquee-dot" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── MANIFESTO ── */}
        <section className="manifesto">
          <div className="reveal-left manifesto-label">Our story</div>
          <p className="reveal-right manifesto-text">
            FIND was built on a single belief — that finding your next home should feel like
            <strong> a beginning, not a burden.</strong> We pair cutting-edge search with
            agents who listen, paperwork that doesn't intimidate, and a process designed
            around <strong>your life, not ours.</strong>
          </p>
        </section>

        {/* ── STATS ── */}
        <div className="stats-band">
          {[
            { num: '12K+', label: 'Properties Listed' },
            { num: '98%',  label: 'Client Satisfaction' },
            { num: '340+', label: 'Expert Agents' },
            { num: '4.9',  label: 'Average Rating' },
          ].map(({ num, label }, i) => (
            <div key={label} className={`stat-block reveal delay-${i + 1}`}>
              <div className="stat-num">{num}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* ── VALUES ── */}
        <section className="values">
          <div className="values-header">
            <div>
              <span className="section-num reveal">02 —</span>
              <h2 className="section-title reveal delay-1">What We Stand For</h2>
            </div>
          </div>

          <div className="values-grid">
            {[
              { name: 'Transparency',  desc: 'No hidden fees, no surprise clauses. Every step of your journey is laid bare so you can decide with full confidence.' },
              { name: 'Expertise',     desc: 'Our agents arent generalists. Each one is deeply specialised in their locale, trained to know what the listings dont say.' },
              { name: 'Integrity',     desc: 'We work for you — not the commission. If a property isnt right, well tell you. Thats the only way to build lasting trust.' },
              { name: 'Precision',     desc: 'Our search technology matches you with properties that genuinely fit your life, not just your budget.' },
              { name: 'Care',          desc: 'Moving is emotional. We treat every client as though this is the most important transaction of their lives — because for you, it is.' },
              { name: 'Legacy',        desc: 'We think beyond the sale. The relationships we build are meant to last decades, not close with a handshake.' },
            ].map(({ name, desc }, i) => (
              <div key={name} className={`value-card reveal delay-${(i % 3) + 1}`}>
                <div className="value-index">0{i + 1}</div>
                <div className="value-name">{name}</div>
                <div className="value-desc">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TEAM ── */}
        <section className="team">
          <div className="team-header">
            <div>
              <span className="section-num reveal">03 —</span>
              <h2 className="section-title reveal delay-1">The People Behind FIND</h2>
            </div>
          </div>

          <div className="team-grid">
            {[
              { name: 'Aryan Mehta',    role: 'Founder & CEO',           initials: 'AM' },
              { name: 'Priya Sharma',   role: 'Head of Client Relations', initials: 'PS' },
              { name: 'Rohan Kapoor',   role: 'Chief Agent Officer',      initials: 'RK' },
            ].map(({ name, role, initials }, i) => (
              <div key={name} className={`team-card reveal delay-${i + 1}`}>
                <div className="team-img-wrap">
                  <div className="team-placeholder">
                    <span className="team-initials">{initials}</span>
                  </div>
                </div>
                <div className="team-name">{name}</div>
                <div className="team-role">{role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section">
          <h2 className="reveal cta-title">
            Ready to<br /><em>Move Forward?</em>
          </h2>
          <br /><br />
          <button className="reveal delay-2 cta-btn">
            Find Your Property
            <svg className="cta-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </button>
        </section>

      </div>
    </>
  );
}