'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Calendar, ChevronDown } from 'lucide-react';
import { useCallStore } from '@/store/callStore';
import { DirectEmailForm } from '@/components/chatbot/DirectEmailForm';

const faqs = [
  {
    question: 'What areas do you serve?',
    answer: 'We operate in the most prestigious neighborhoods across Mumbai, Dubai, New York, and Monaco. This includes Bandra, Juhu, Powai in Mumbai, Downtown Dubai, Emirates Hills, Upper East Side in Manhattan, and more.',
  },
  {
    question: 'How do I schedule a property viewing?',
    answer: 'You can schedule a viewing through our website by clicking "Schedule a Meeting" or by calling our office directly. We offer both in-person and virtual viewings.',
  },
  {
    question: 'What services do you offer?',
    answer: 'We offer a comprehensive range of services including property buying, selling, renting, investment advisory, and property management for luxury real estate.',
  },
  {
    question: 'Do you work with international clients?',
    answer: 'Yes, we have extensive experience working with international clients and can assist with currency exchange, legal requirements, and remote transaction management.',
  },
  {
    question: 'What are your commission rates?',
    answer: 'Our commission rates vary based on the property type and transaction value. Contact us for a personalized quote based on your specific requirements.',
  },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const openCallOptions = useCallStore((state) => state.openCallOptions);
  const openScheduleModal = useCallStore((state) => state.openScheduleModal);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-neutral-900 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Get in touch with our team of luxury real estate experts
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
              Send Us a Message
            </h2>
            <DirectEmailForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                Contact Information
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-white">Office Address</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      123 Luxury Lane, Bandra West<br />
                      Mumbai 400050, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-white">Phone</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-white">Email</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">hello@luxeestates.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-white">Office Hours</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Mon - Sat: 9:00 AM - 7:00 PM<br />
                      Sunday: By Appointment
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">
                  Prefer to speak directly?
                </h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => openCallOptions()}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Call Us
                  </button>
                  <button
                    onClick={() => openScheduleModal()}
                    className="flex-1 py-3 border border-neutral-300 dark:border-neutral-700 hover:border-amber-500 text-neutral-900 dark:text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    Book Meeting
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-neutral-200 dark:bg-neutral-800 rounded-2xl h-64 flex items-center justify-center">
              <p className="text-neutral-500">Map integration coming soon</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          id="faq"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold font-serif text-neutral-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-neutral-900 rounded-xl shadow overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
