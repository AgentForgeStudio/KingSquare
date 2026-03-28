'use client';

import { motion } from 'framer-motion';
import { Award, Users, Building, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Building, value: '500+', label: 'Properties Sold' },
  { icon: Users, value: '1,200+', label: 'Happy Clients' },
  { icon: Award, value: '15+', label: 'Years Experience' },
  { icon: TrendingUp, value: '₹2,500 Cr', label: 'Portfolio Value' },
];

const team = [
  {
    name: 'Priya Sharma',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    bio: 'With over 20 years in luxury real estate, Priya founded LUXE Estates to redefine how discerning clients find their dream homes.',
  },
  {
    name: 'Arjun Patel',
    role: 'Head of Sales',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    bio: 'Arjun brings his expertise in Mumbai\'s premium markets to help clients find the perfect property match.',
  },
  {
    name: 'Sarah Ahmed',
    role: 'Dubai Operations Lead',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    bio: 'Based in Dubai, Sarah oversees our international portfolio and serves our UAE-based clients.',
  },
  {
    name: 'Michael Chen',
    role: 'Investment Advisor',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    bio: 'Michael specializes in real estate investment strategies and portfolio management for high-net-worth clients.',
  },
];

const timeline = [
  { year: '2009', event: 'LUXE Estates founded in Mumbai' },
  { year: '2012', event: 'Expanded to premium residential markets' },
  { year: '2015', event: 'Dubai office opened' },
  { year: '2018', event: 'International portfolio reaches $500M' },
  { year: '2021', event: 'Launched AI-powered property matching' },
  { year: '2024', event: '500+ properties sold milestone' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold font-serif text-neutral-900 dark:text-white mb-6">
            About LUXE Estates
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Transforming the luxury real estate experience through innovation, expertise, and unwavering commitment to excellence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-12 text-center text-white mb-20"
        >
          <blockquote className="text-2xl md:text-3xl font-serif italic mb-6">
            "We don't just sell properties. We help our clients find homes that inspire their lives."
          </blockquote>
          <p className="font-medium">— Priya Sharma, Founder</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-6 text-center shadow-lg"
            >
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-7 h-7 text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold font-serif text-neutral-900 dark:text-white text-center mb-12">
            Our Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-amber-500 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold font-serif text-neutral-900 dark:text-white text-center mb-12">
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-amber-500/30" />
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-lg inline-block">
                      <p className="text-2xl font-bold text-amber-500 mb-1">{item.year}</p>
                      <p className="text-neutral-900 dark:text-white font-medium">{item.event}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-amber-500 rounded-full relative z-10" />
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
