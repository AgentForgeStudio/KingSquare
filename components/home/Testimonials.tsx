'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rajiv Mehta',
    role: 'Tech Entrepreneur',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop',
    content: 'KingSquare found us the perfect penthouse in Bandra within two weeks. Their attention to our specific requirements was remarkable. The entire process was seamless.',
    rating: 5,
    property: 'Oceanfront Penthouse, Bandra',
  },
  {
    name: 'Priya Kapoor',
    role: 'Investment Banker',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop',
    content: 'As someone who values discretion and efficiency, KingSquare exceeded my expectations. Their market knowledge and negotiation skills saved us both time and money.',
    rating: 5,
    property: 'Manhattan Sky Penthouse',
  },
  {
    name: 'Arjun Shah',
    role: 'Film Producer',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop',
    content: 'The team at KingSquare went above and beyond for our family estate in Goa. Their understanding of luxury lifestyle needs is unmatched. Truly world-class service.',
    rating: 5,
    property: 'Beachfront Villa, Goa',
  },
  {
    name: 'Sarah Mitchell',
    role: 'CEO, Mitchell Group',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop',
    content: 'Investing in Dubai property through KingSquare was the best decision. Their international network and local expertise made a complex process feel effortless.',
    rating: 5,
    property: 'Downtown Dubai Residence',
  },
];

export function Testimonials() {
  return (
    <section className="py-32 bg-[#070707] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-gold-400 font-medium tracking-widest uppercase text-xs">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-neutral-50 font-playfair tracking-tight">
            What Our Clients Say
          </h2>
          <div className="w-16 h-px bg-gradient-gold mx-auto mb-6"></div>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-light">
            Trusted by discerning clients worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="premium-glass rounded-2xl p-10 relative group hover:-translate-y-2 transition-transform duration-500"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-gold-500/10 group-hover:text-gold-500/20 transition-colors" />

              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                ))}
              </div>

              <p className="text-neutral-300 md:text-lg mb-8 leading-relaxed font-light italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-neutral-800">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gold-500/30">
                  <Image
                    src={testimonial.photo}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-playfair font-bold text-xl text-neutral-50 tracking-wide">
                    {testimonial.name}
                  </p>
                  <p className="text-xs tracking-widest uppercase text-neutral-500 mt-1">{testimonial.role}</p>
                  <p className="text-sm text-gold-400 mt-0.5 font-medium">{testimonial.property}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

