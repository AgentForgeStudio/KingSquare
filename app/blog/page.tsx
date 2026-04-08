'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const categories = ['All', 'Market Insights', 'Buying Guide', 'Lifestyle', 'Investment'];

const posts = [
  {
    id: 1,
    slug: 'luxury-waterfront-mumbai',
    title: 'The Rise of Luxury Waterfront Properties in Naigaon',
    excerpt:
      'Explore why waterfront living has become the ultimate symbol of prestige in Naigaon real estate.',
    category: 'Market Insights',
    image: '/cloud.jpeg',
    author: 'Priya Sharma',
    date: 'March 15, 2026',
    readTime: '8 min read',
    featured: true,
  },
  {
    id: 2,
    slug: 'buying-first-luxury-home',
    title: 'Complete Guide to Buying Your First Luxury Home',
    excerpt:
      'Everything you need to know about purchasing a premium property.',
    category: 'Buying Guide',
    image: '/cloud.jpeg',
    author: 'Arjun Patel',
    date: 'March 10, 2026',
    readTime: '12 min read',
  },
  {
    id: 3,
    slug: 'dubai-vs-mumbai-investment',
    title: 'Virar vs Naigaon: Where Should You Invest in 2026?',
    excerpt: 'Comparison of two luxury real estate markets.',
    category: 'Investment',
    image: '/cloud.jpeg',
    author: 'Sarah Ahmed',
    date: 'March 5, 2026',
    readTime: '10 min read',
  },
  {
    id: 4,
    slug: 'luxury-interior-trends',
    title: 'Interior Design Trends for Luxury Homes',
    excerpt: 'Discover latest luxury interior concepts.',
    category: 'Lifestyle',
    image: '/cloud.jpeg',
    author: 'Design Team',
    date: 'Feb 28, 2026',
    readTime: '6 min read',
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const { scrollYProgress } = useScroll();

  // 🔥 Smooth parallax scale + opacity
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);

  const filteredPosts =
    activeCategory === 'All'
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  const featuredPost = posts.find((p) => p.featured);

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-hidden">
      {/* 🔥 HERO SECTION WITH PARALLAX */}
      <motion.div
        style={{ scale, opacity }}
        className="relative h-[70vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src={featuredPost?.image || ''}
            alt="hero"
            fill
            priority
            className="object-cover brightness-50"
          />
        </div>

        {/* 🔥 CLOUD GRADIENT EFFECT */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center z-10"
        >
          <h1 className="text-6xl font-bold tracking-tight mb-4">
            KingSquare Insights
          </h1>
          <p className="text-lg text-neutral-300">
            Premium real estate intelligence & trends
          </p>
        </motion.div>
      </motion.div>

      {/* 🔥 CATEGORY FILTER */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex gap-3 justify-center flex-wrap mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm transition-all ${
                activeCategory === cat
                  ? 'bg-white text-black'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 🔥 FEATURED CARD */}
        {featuredPost && activeCategory === 'All' && (
          <Link href={`/blog/${featuredPost.slug}`}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="group relative rounded-3xl overflow-hidden mb-16 cursor-pointer"
            >
              <div className="relative h-[400px]">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>

              <div className="absolute bottom-0 p-10">
                <span className="text-amber-400 text-sm">
                  {featuredPost.category}
                </span>
                <h2 className="text-3xl font-bold mt-2 mb-3">
                  {featuredPost.title}
                </h2>
                <p className="text-neutral-300 mb-4">
                  {featuredPost.excerpt}
                </p>

                <div className="flex gap-4 text-sm text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {featuredPost.readTime}
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        )}

        {/* 🔥 GRID POSTS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, i) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8 }}
                className="group rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-amber-400 transition">
                    {post.title}
                  </h3>

                  <p className="text-sm text-neutral-400 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>{post.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {post.readTime}
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
