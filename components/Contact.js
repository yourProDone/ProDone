import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle } from 'lucide-react';
import Logo from './Logo';

const CALENDLY_URL = 'https://calendly.com/yourprodone/30min?hide_event_type_details=1&hide_gdpr_banner=1';

const Contact = () => {
  const [showCalendly, setShowCalendly] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const calendlyWidgetRef = useRef(null);

  // Listen for calendly.event_scheduled globally
  useEffect(() => {
    const handler = (e) => {
      if (e.data.event && e.data.event === 'calendly.event_scheduled') {
        setShowCalendly(false);
        setShowConfirmation(true);

        // Store meeting details for the popup
        if (e.data.payload) {
          const { invitee, event } = e.data.payload;
          const meetingDetails = {
            eventType: event.name || 'Consultation Call',
            inviteeName: invitee.name || 'You',
            inviteeEmail: invitee.email || '',
            meetingTime: new Date(event.start_time).toLocaleString(),
            meetingLink: event.location || event.conferencing?.join_url || '',
            confirmationEmail: true
          };

          // Store in localStorage for the popup to access
          localStorage.setItem('calendly_meeting_details', JSON.stringify(meetingDetails));

          // Store meeting link separately for easy access
          if (meetingDetails.meetingLink) {
            localStorage.setItem('calendly_meeting_link', meetingDetails.meetingLink);
          }
        }

        setTimeout(() => setShowConfirmation(false), 7000);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Dynamically load Calendly script and init widget when modal opens
  useEffect(() => {
    if (!showCalendly) return;
    // Add Calendly script if not present
    if (!document.getElementById('calendly-script')) {
      const script = document.createElement('script');
      script.id = 'calendly-script';
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        if (window.Calendly) {
          window.Calendly.initInlineWidget({
            url: CALENDLY_URL,
            parentElement: calendlyWidgetRef.current,
            prefill: {
              name: '',
              email: '',
              firstName: '',
              lastName: '',
              guests: [],
              customAnswers: {}
            },
            utm: {
              utmCampaign: 'website',
              utmSource: 'prodone',
              utmMedium: 'contact'
            }
          });
        }
      };
    } else {
      // Script already loaded
      if (window.Calendly) {
        window.Calendly.initInlineWidget({
          url: CALENDLY_URL,
          parentElement: calendlyWidgetRef.current,
          prefill: {
            name: '',
            email: '',
            firstName: '',
            lastName: '',
            guests: [],
            customAnswers: {}
          },
          utm: {
            utmCampaign: 'website',
            utmSource: 'prodone',
            utmMedium: 'contact'
          }
        });
      }
    }
    // Fix: copy ref to variable for cleanup
    const widgetDiv = calendlyWidgetRef.current;
    return () => {
      if (widgetDiv) {
        widgetDiv.innerHTML = '';
      }
    };
  }, [showCalendly]);

  // Listen for custom event to open Calendly meeting
  useEffect(() => {
    const handler = () => setShowCalendly(true);
    window.addEventListener('open-calendly-meeting', handler);
    return () => window.removeEventListener('open-calendly-meeting', handler);
  }, []);

  return (
    <section id="contact" className="section-padding bg-dark-900/50">
      <div className="container-custom flex flex-col items-center justify-center min-h-[40vh]">
        {showConfirmation ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center bg-gradient-to-br from-green-500/90 via-green-600/90 to-green-700/90 rounded-3xl shadow-3xl border-0 px-8 py-12 max-w-md w-full text-center relative overflow-hidden"
            style={{
              boxShadow: '0 8px 32px 0 rgba(34,197,94,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div className="absolute inset-0 pointer-events-none z-0">
              <svg width="100%" height="100%" viewBox="0 0 400 400" className="absolute inset-0 w-full h-full" style={{ opacity: 0.12 }}>
                <defs>
                  <radialGradient id="popupGlow" cx="50%" cy="50%" r="80%">
                    <stop offset="0%" stopColor="#bbf7d0" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="400" height="400" fill="url(#popupGlow)" />
              </svg>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/10 shadow-lg mb-4 border-2 border-green-400">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <h2 className="text-3xl font-extrabold text-green-100 mb-2 drop-shadow-lg">You are scheduled!</h2>
              <p className="text-lg text-green-50 mb-4">Your meeting has been booked.<br />Check your email for the confirmation and Google Meet link.</p>
              <button
                onClick={() => setShowConfirmation(false)}
                className="mt-2 px-7 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
              Book With Us
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 text-white drop-shadow-lg">
              Schedule a Meeting With Our <span className="gradient-text">Experts</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Let us help you take your business to the next level. Book a free strategy session with our team and discover how we can deliver results for your brand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4 w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.dispatchEvent(new Event('open-lead-magnet'))}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg sm:text-xl px-8 py-4 rounded-2xl shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400/40 w-full sm:w-auto"
              >
                <span className="inline-flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Send Message
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowCalendly(true)}
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg sm:text-xl px-8 py-4 rounded-2xl shadow-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-400/40 w-full sm:w-auto"
              >
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  📞 Get Free Consultation
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
        {showCalendly && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 30 }}
              transition={{ duration: 0.35 }}
              className="relative bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900 rounded-3xl shadow-3xl border border-primary-700/40 w-full max-w-3xl p-0 overflow-hidden flex flex-col md:flex-row items-stretch"
              style={{
                boxShadow: '0 8px 32px 0 rgba(59,130,246,0.18), 0 1.5px 8px 0 rgba(0,0,0,0.10)',
                backdropFilter: 'blur(12px)'
              }}
            >
              <button
                onClick={() => setShowCalendly(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl z-10 transition-colors duration-150 rounded-full bg-white/5 hover:bg-white/10 w-10 h-10 flex items-center justify-center"
                aria-label="Close"
                style={{ lineHeight: 1 }}
              >×</button>
              {/* Agency Details - Left Side */}
              <div className="hidden md:flex flex-col justify-center items-start bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 px-8 py-10 w-full max-w-xs border-r border-dark-800">
                <div className="mb-6">
                  <Logo size="default" className="mb-2" />
                  <h3 className="text-2xl font-bold text-white mb-2">ProDone Agency</h3>
                  <p className="text-gray-400 mb-4">We build high-performing digital solutions for ambitious brands. Trusted by industry leaders.</p>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-2 text-gray-300">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7.5" /><path d="M16 17l2 2 4-4" /></svg>
                    yourprodone@gmail.com
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2h2.09a2 2 0 0 1 2 1.72c.13.81.28 1.6.46 2.36a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.76.18 1.55.33 2.36.46A2 2 0 0 1 22 16.92z" /></svg>
                    +91 96636 14603
                  </div>
                </div>
              </div>
              {/* Calendly Widget - Right Side */}
              <div className="flex-1 flex flex-col justify-center items-center bg-white p-0 min-w-[320px]" style={{ minHeight: 700 }}>
                <div
                  ref={calendlyWidgetRef}
                  id="calendly-inline-widget"
                  className="w-full h-[700px] bg-white rounded-b-3xl overflow-hidden"
                  style={{ minHeight: 700, padding: 0 }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact; 