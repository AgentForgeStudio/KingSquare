'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, ArrowLeft, CheckCircle, Calendar, ExternalLink } from 'lucide-react';
import { useCallStore } from '@/store/callStore';
import { useLeadStore } from '@/store/leadStore';
import { format } from 'date-fns';

const TIME_SLOTS = [
  { time: '9:00 AM', label: 'Morning' },
  { time: '10:00 AM', label: 'Morning' },
  { time: '11:00 AM', label: 'Morning' },
  { time: '12:00 PM', label: 'Morning' },
  { time: '2:00 PM', label: 'Afternoon' },
  { time: '3:00 PM', label: 'Afternoon' },
  { time: '4:00 PM', label: 'Afternoon' },
  { time: '5:00 PM', label: 'Afternoon' },
];

export function ScheduleMeetingModal() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isModalOpen = useCallStore((state) => state.isScheduleModalOpen);
  const closeScheduleModal = useCallStore((state) => state.closeScheduleModal);
  const scheduledProperty = useCallStore((state) => state.scheduledProperty);
  const markCaptured = useLeadStore((state) => state.markCaptured);
  const setLead = useLeadStore((state) => state.setLead);

  useEffect(() => {
    if (scheduledProperty) {
      setFormData((prev) => ({
        ...prev,
        notes: `I'm interested in: ${scheduledProperty}`,
      }));
    }
  }, [scheduledProperty]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);

  const handleDateSelect = (date: Date) => {
    const day = date.getDay();
    if (day === 0) return;
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleNext = () => {
    if (step === 1 && selectedDate && selectedTime) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'MEETING_SCHEDULED',
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          notes: formData.notes,
          date: format(selectedDate!, 'EEEE, d MMMM yyyy'),
          time: selectedTime,
          source: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        markCaptured(formData.phone, 'schedule-modal');
        setLead({
          name: formData.name,
          email: formData.email,
        });
        setIsSuccess(true);

        const startDate = new Date(`${format(selectedDate!, 'yyyy-MM-dd')} ${selectedTime}`);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Meeting+with+LUXE+Estates&dates=${format(startDate, "yyyyMMdd'T'HHmmss")}/${format(endDate, "yyyyMMdd'T'HHmmss")}&details=Your+meeting+with+LUXE+Estates+team&location=LUXE+Estates+Office`;

        setTimeout(() => {
          window.open(googleCalendarUrl, '_blank');
        }, 1000);
      }
    } catch (error) {
      console.error('Schedule error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    closeScheduleModal();
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData({ name: '', phone: '', email: '', notes: '' });
    setIsSuccess(false);
  };

  const canProceed = () => {
    if (step === 1) return selectedDate && selectedTime;
    if (step === 2) return formData.name && formData.phone && formData.email;
    return true;
  };

  if (!isModalOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg border border-neutral-800 overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {!isSuccess ? (
          <>
            <div className="p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-amber-500" />
                <h2 className="text-xl font-bold text-white">Schedule a Meeting</h2>
              </div>

              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1">
                    <div
                      className={`h-2 rounded-full transition-colors ${
                        s <= step ? 'bg-amber-500' : 'bg-neutral-700'
                      }`}
                    />
                    <p className="text-xs text-neutral-500 mt-1 text-center">
                      {s === 1 && 'Date & Time'}
                      {s === 2 && 'Your Details'}
                      {s === 3 && 'Confirm'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Pick a Date & Time</h3>

                  <div className="mb-6">
                    <div className="bg-neutral-800 rounded-xl p-4 text-center">
                      <p className="text-neutral-400 text-sm mb-2">
                        {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
                      </p>
                      <div className="grid grid-cols-7 gap-1 mt-4">
                        {Array.from({ length: 35 }, (_, i) => {
                          const date = new Date(tomorrow);
                          date.setDate(tomorrow.getDate() + Math.floor(i / 7));
                          const dayOfWeek = date.getDay();
                          
                          while (date <= maxDate && (date < tomorrow || dayOfWeek === 0 || date.getDay() === 0)) {
                            date.setDate(date.getDate() + 1);
                          }
                          
                          const isPast = date < tomorrow;
                          const isSunday = date.getDay() === 0;
                          const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                          const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

                          return (
                            <button
                              key={i}
                              onClick={() => !isPast && !isSunday && handleDateSelect(new Date(date))}
                              disabled={isPast || isSunday}
                              className={`p-2 rounded-lg text-sm transition-colors ${
                                isSelected
                                  ? 'bg-amber-500 text-white'
                                  : isToday
                                  ? 'border border-amber-500 text-amber-500'
                                  : isPast || isSunday
                                  ? 'text-neutral-700 cursor-not-allowed'
                                  : 'text-neutral-300 hover:bg-neutral-700'
                              }`}
                            >
                              {date.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {selectedDate && (
                    <div>
                      <p className="text-neutral-400 text-sm mb-3">Available time slots</p>
                      <div className="space-y-3">
                        {['Morning', 'Afternoon'].map((period) => (
                          <div key={period}>
                            <p className="text-xs text-neutral-500 mb-2">{period}</p>
                            <div className="flex flex-wrap gap-2">
                              {TIME_SLOTS.filter((slot) => slot.label === period).map((slot) => (
                                <button
                                  key={slot.time}
                                  onClick={() => setSelectedTime(slot.time)}
                                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                                    selectedTime === slot.time
                                      ? 'bg-amber-500 text-white'
                                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                                  }`}
                                >
                                  {slot.time}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Your Details</h3>
                  <p className="text-neutral-400 text-sm mb-4">
                    So we know who to expect and how to reach you
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-800 rounded-lg text-white border border-neutral-700 focus:border-amber-500 focus:outline-none transition-colors"
                        placeholder="Rahul Sharma"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">
                        📱 Your mobile number
                      </label>
                      <p className="text-xs text-neutral-500 mb-2">We'll send a reminder SMS</p>
                      <div className="flex gap-2">
                        <span className="flex items-center px-4 py-3 bg-neutral-800 rounded-lg text-neutral-300 text-sm border border-neutral-700">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })
                          }
                          className="flex-1 px-4 py-3 bg-neutral-800 rounded-lg text-white border border-neutral-700 focus:border-amber-500 focus:outline-none transition-colors"
                          placeholder="98765 43210"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">
                        📧 For your meeting confirmation
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-800 rounded-lg text-white border border-neutral-700 focus:border-amber-500 focus:outline-none transition-colors"
                        placeholder="rahul@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">Notes (optional)</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-neutral-800 rounded-lg text-white border border-neutral-700 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                        placeholder="Any properties you're interested in? Questions for us?"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Confirm Your Booking</h3>

                  <div className="bg-neutral-800 rounded-xl p-4 space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">📅 Date & Time</span>
                      <button onClick={() => setStep(1)} className="text-amber-500 text-sm hover:underline">
                        Edit
                      </button>
                    </div>
                    <p className="text-white font-medium">
                      {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
                    </p>

                    <div className="border-t border-neutral-700 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">👤 Name</span>
                        <button onClick={() => setStep(2)} className="text-amber-500 text-sm hover:underline">
                          Edit
                        </button>
                      </div>
                      <p className="text-white font-medium">{formData.name}</p>
                    </div>

                    <div>
                      <span className="text-neutral-400">📱 Phone</span>
                      <p className="text-white font-medium">+91 {formData.phone}</p>
                    </div>

                    <div>
                      <span className="text-neutral-400">✉️ Email</span>
                      <p className="text-white font-medium">{formData.email}</p>
                    </div>

                    {formData.notes && (
                      <div>
                        <span className="text-neutral-400">📝 Notes</span>
                        <p className="text-white font-medium">{formData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-neutral-800 flex gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                onClick={step === 3 ? handleSubmit : handleNext}
                disabled={!canProceed() || isSubmitting}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="animate-spin">⏳</span>
                ) : step === 3 ? (
                  <>
                    <Check className="w-5 h-5" />
                    Confirm Booking
                  </>
                ) : (
                  <>
                    Next
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">Meeting Confirmed! 🎉</h3>
            <p className="text-neutral-400 mb-2">
              We've sent a confirmation to {formData.email}
            </p>
            <p className="text-neutral-400 mb-6">
              📱 You'll receive an SMS reminder at +91 {formData.phone}
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const startDate = new Date(`${format(selectedDate!, 'yyyy-MM-dd')} ${selectedTime}`);
                  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
                  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Meeting+with+LUXE+Estates&dates=${format(startDate, "yyyyMMdd'T'HHmmss")}/${format(endDate, "yyyyMMdd'T'HHmmss")}&details=Your+meeting+with+LUXE+Estates+team&location=LUXE+Estates+Office`;
                  window.open(googleCalendarUrl, '_blank');
                }}
                className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Add to Google Calendar
              </a>
              <button
                onClick={handleClose}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
