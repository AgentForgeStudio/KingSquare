'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useLeadStore } from '@/store/leadStore';

const PROPERTY_TYPES = [
  'Apartment',
  'Villa',
  'Penthouse',
  'Estate',
  'Townhouse',
];

const ENQUIRY_TYPES = [
  { id: 'buy', label: 'Buy Property' },
  { id: 'rent', label: 'Rent Property' },
  { id: 'sell', label: 'Sell My Property' },
  { id: 'investment', label: 'Investment Advice' },
];

export function EnquiryForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    enquiryType: '',
    propertyTypes: [] as string[],
    budgetMin: 5000000,
    budgetMax: 50000000,
    location: '',
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const markCaptured = useLeadStore((state) => state.markCaptured);
  const setLead = useLeadStore((state) => state.setLead);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PROPERTY_ENQUIRY',
          enquiryType: formData.enquiryType,
          propertyTypes: formData.propertyTypes.join(', '),
          budgetMin: formData.budgetMin,
          budgetMax: formData.budgetMax,
          location: formData.location,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
          source: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        markCaptured(formData.phone, 'enquiry-form');
        setLead({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        });
        setIsSuccess(true);
      }
    } catch (error) {
      console.error('Enquiry error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatBudget = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
    return `₹${value.toLocaleString()}`;
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-full text-center p-6"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Enquiry Sent! ✓</h3>
        <p className="text-neutral-400 mb-2">
          We'll reach out to {formData.name} at +91 {formData.phone} within 24 hours
        </p>
        <p className="text-neutral-500 text-sm mt-4">
          While you wait → <a href="/properties" className="text-amber-500 hover:underline">Browse Properties</a>
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-neutral-400 text-sm">
          Step {step} of 2
        </p>
        <div className="flex justify-center gap-1 mt-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 w-12 rounded-full transition-colors ${
                s <= step ? 'bg-amber-500' : 'bg-neutral-700'
              }`}
            />
          ))}
        </div>
      </div>

      {step === 1 && (
        <>
          <div>
            <label className="block text-sm text-neutral-300 mb-3">Enquiry Type</label>
            <div className="grid grid-cols-2 gap-2">
              {ENQUIRY_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFormData({ ...formData, enquiryType: type.id })}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    formData.enquiryType === type.id
                      ? 'bg-amber-500 text-white'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-neutral-300 mb-3">Property Type</label>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    const types = formData.propertyTypes.includes(type)
                      ? formData.propertyTypes.filter((t) => t !== type)
                      : [...formData.propertyTypes, type];
                    setFormData({ ...formData, propertyTypes: types });
                  }}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    formData.propertyTypes.includes(type)
                      ? 'bg-amber-500 text-white'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-neutral-300 mb-3">Budget Range</label>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-amber-500 font-medium">{formatBudget(formData.budgetMin)}</span>
              <span className="text-neutral-500">–</span>
              <span className="text-amber-500 font-medium">{formatBudget(formData.budgetMax)}</span>
            </div>
            <div className="space-y-4">
              <input
                type="range"
                min="5000000"
                max="500000000"
                step="5000000"
                value={formData.budgetMin}
                onChange={(e) => setFormData({ ...formData, budgetMin: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
              <input
                type="range"
                min="5000000"
                max="500000000"
                step="5000000"
                value={formData.budgetMax}
                onChange={(e) => setFormData({ ...formData, budgetMax: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-neutral-300 mb-1">Preferred Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Bandra, South Mumbai"
              className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white border border-neutral-700 focus:border-amber-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!formData.enquiryType}
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p className="text-neutral-400 text-sm text-center mb-4">
            Almost done! How should we reach you?
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white border border-neutral-700 focus:border-amber-500 focus:outline-none transition-colors"
                placeholder="Rahul Sharma"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-1">
                📱 Best number to reach you
              </label>
              <p className="text-xs text-neutral-500 mb-2">We'll send matching properties via WhatsApp</p>
              <div className="flex gap-2">
                <span className="flex items-center px-4 py-3 bg-neutral-800 rounded-xl text-neutral-300 text-sm border border-neutral-700">
                  +91
                </span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })
                  }
                  className="flex-1 px-4 py-3 bg-neutral-800 rounded-xl text-white border-2 border-amber-500/50 focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="98765 43210"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-1">📧 For detailed property reports</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white border border-neutral-700 focus:border-amber-500 focus:outline-none transition-colors"
                placeholder="rahul@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-1">Message (optional)</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white border border-neutral-700 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                placeholder="Any specific requirements? E.g. sea-facing, near school, etc."
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.phone || !formData.email || isSubmitting}
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <>
                Send Enquiry
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
