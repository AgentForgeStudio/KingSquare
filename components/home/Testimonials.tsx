'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rajiv Mehta',
    role: 'Tech Entrepreneur',
    photo: '/cloud.jpeg',
    content: 'LUXE Estates found us the perfect penthouse in Bandra within two weeks. Their attention to our specific requirements was remarkable. The entire process was seamless.',
    rating: 5,
    property: 'Oceanfront Penthouse, Bandra',
  },
  {
    name: 'Priya Kapoor',
    role: 'Investment Banker',
    photo: '/cloud.jpeg',
    content: 'As someone who values discretion and efficiency, LUXE Estates exceeded my expectations. Their market knowledge and negotiation skills saved us both time and money.',
    rating: 5,
    property: 'Manhattan Sky Penthouse',
  },
  {
    name: 'Arjun Shah',
    role: 'Film Producer',
    photo: '/cloud.jpeg',
    content: 'The team at LUXE went above and beyond for our family estate in Goa. Their understanding of luxury lifestyle needs is unmatched. Truly world-class service.',
    rating: 5,
    property: 'Beachfront Villa, Goa',
  },
  {
    name: 'Sarah Mitchell',
    role: 'CEO, Mitchell Group',
    photo: '/cloud.jpeg',
    content: 'Investing in Dubai property through LUXE Estates was the best decision. Their international network and local expertise made a complex process feel effortless.',
    rating: 5,
    property: 'Downtown Dubai Residence',
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-amber-500 font-medium tracking-wider uppercase text-sm">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-5 text-neutral-900 dark:text-white font-serif tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
            Trusted by discerning clients worldwide
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
              className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-amber-500/20" />
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.photo}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-neutral-500">{testimonial.role}</p>
                  <p className="text-xs text-amber-500 mt-0.5">{testimonial.property}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
