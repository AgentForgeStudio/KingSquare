'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { blogPosts, getBlogPostBySlug } from '@/data/blogPosts';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = getBlogPostBySlug(slug);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const article = document.getElementById('article-content');
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const totalHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(100, (scrolled / (totalHeight - windowHeight)) * 100);
      setReadingProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-amber-500 hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const recentPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 pt-20">
      <div className="fixed top-20 left-0 right-0 h-1 bg-neutral-200 z-50">
        <div
          className="h-full bg-amber-500 transition-all duration-100"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <article id="article-content">
        <div className="relative h-[60vh] min-h-[400px]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full mb-4"
            >
              {post.category}
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-white font-serif mb-4 leading-tight"
            >
              {post.title}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-6 text-white/70 text-sm"
            >
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {post.readTime}
              </span>
            </motion.div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            {post.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('## ')) {
                return <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-neutral-900 dark:text-white">{paragraph.replace('## ', '')}</h2>;
              }
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return <p key={i} className="font-semibold text-neutral-900 dark:text-white">{paragraph.replace(/\*\*/g, '')}</p>;
              }
              if (paragraph.startsWith('- ') || paragraph.startsWith('**')) {
                return <p key={i} className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{paragraph.replace(/\*\*/g, '')}</p>;
              }
              return <p key={i} className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">{paragraph}</p>;
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden">
                  <Image src={post.authorPhoto} alt={post.author} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">{post.author}</p>
                  <p className="text-sm text-neutral-500">LUXE Estates Expert</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500 mr-2">Share:</span>
                {/* <a href={`https://facebook.com`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                  <Facebook className="w-4 h-4" />
                </a> */}
                {/* <a href={`https://twitter.com`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                  <Twitter className="w-4 h-4" />
                </a> */}
                {/* <a href={`https://linkedin.com`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a> */}
              </div>
            </div>
          </motion.div>
        </div>
      </article>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-2xl font-bold mb-8 text-neutral-900 dark:text-white font-serif">Related Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentPosts.map((rp) => (
            <Link key={rp.id} href={`/blog/${rp.slug}`}>
              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl overflow-hidden group">
                <div className="relative h-40 overflow-hidden">
                  <Image src={rp.image} alt={rp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <span className="text-xs text-amber-500 font-medium">{rp.category}</span>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mt-1 mb-2 group-hover:text-amber-500 transition-colors">
                    {rp.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span>{rp.author}</span>
                    <span>{rp.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
