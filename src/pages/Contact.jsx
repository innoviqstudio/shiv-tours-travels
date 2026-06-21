import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const contactDetails = [
    {
      title: 'Call Us',
      desc: 'Talk to our travel experts 24/7.',
      actionLabel: 'Call Now',
      actionUrl: 'tel:+919405601603',
      val1: '+91 9405601603',
      val2: 'Available 24/7',
      icon: Phone
    },
    {
      title: 'WhatsApp Us',
      desc: 'Send a message for quick booking quotes.',
      actionLabel: 'WhatsApp Chat',
      actionUrl: 'https://wa.me/918010936793?text=Hello%20Shiv%20Travels,%20I%20want%20to%20enquire%20about%20a%20cab%20booking.',
      val1: '+91 8010936793',
      val2: 'Available 24x7',
      icon: MessageSquare
    },
    {
      title: 'Email Us',
      desc: 'Write to us for tour packages or corporate ties.',
      actionLabel: 'Send Email',
      actionUrl: 'mailto:info@shivtoursandtravels.com',
      val1: 'info@shivtoursandtravels.com',
      val2: 'Response in 2 hours',
      icon: Mail
    },
    {
      title: 'Office Location',
      desc: 'Visit us at our primary agency branch.',
      actionLabel: 'Open in Map',
      actionUrl: 'https://www.google.com/maps/place/Shiv+Tours+And+Travels/@20.0166362,73.7617188,17z/data=!4m14!1m7!3m6!1s0x3bddeba232f6a8bb:0xbbc6314cfb9b277b!2sShiv+Tours+And+Travels!8m2!3d20.0166362!4d73.7617188!16s%2Fg%2F11xcngthdz!3m5!1s0x3bddeba232f6a8bb:0xbbc6314cfb9b277b!8m2!3d20.0166362!4d73.7617188!16s%2Fg%2F11xcngthdz?hl=en-IN&entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D',
      val1: 'Building No 01, Anay Coop Housing Society Ltd,',
      val2: 'Near Prasad Mangal Karyalay, D. K. Nagar, Nashik - 422013',
      icon: MapPin
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Your name is required';
    if (!formData.message.trim()) newErrors.message = 'Please type a message';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit number';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const res = await axios.post('/api/inquiries', formData);
        if (res.data.success) {
          setShowSuccess(true);
          setFormData({ name: '', email: '', phone: '', message: '' });
          setTimeout(() => setShowSuccess(false), 5000);
        } else {
          alert('Failed to send message. Please try again.');
        }
      } catch (err) {
        alert('Failed to send message. Server connection error.');
      }
    }
  };

  return (
    <div className="pt-24 bg-slate-50 min-h-screen">
      {/* 1. Banner */}
      <section className="relative bg-navy py-16 text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80" 
            alt="Contact Us Banner" 
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-navy/85" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold">Contact Us</h1>
          <p className="text-slate-300 mt-3 max-w-lg mx-auto text-sm sm:text-base">
            Get in touch with Shiv Tours & Travels. Call us directly or send a message below for custom travel bookings.
          </p>
        </div>
      </section>

      {/* 2. Direct Contact Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactDetails.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                key={index}
                className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-lg transition-shadow"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-dark">{item.title}</h3>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                  <div className="text-sm font-semibold text-navy leading-relaxed">
                    <div className="truncate">{item.val1}</div>
                    <div className="truncate">{item.val2}</div>
                  </div>
                </div>
                
                <a 
                  href={item.actionUrl} 
                  target={item.actionUrl.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-slate-50 hover:bg-gold hover:text-navy-dark border border-slate-200 hover:border-gold text-slate-600 font-bold text-xs rounded-xl text-center transition-all block"
                >
                  {item.actionLabel}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Map & Contact Form */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left side Form */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200/60 p-8 sm:p-10 rounded-3xl space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold tracking-widest text-gold uppercase block">Send Message</span>
                <h2 className="text-2xl font-bold text-navy-dark">Send Us a Travel Inquiry</h2>
                <p className="text-xs text-slate-500">
                  Fill up this form and our customer support agent will call you back within 15 minutes.
                </p>
              </div>

              {showSuccess && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-start space-x-2 text-green-700 text-sm">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Thank you! Your travel message has been received. Our team will contact you shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Your Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Sanjay Patil"
                      className={`w-full bg-white border ${errors.name ? 'border-red-400' : 'border-slate-200 focus:border-gold'} rounded-xl py-3 px-4 text-slate-800 text-sm focus:outline-none transition-colors`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1" />{errors.name}</p>}
                  </div>
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter 10-digit number"
                      className={`w-full bg-white border ${errors.phone ? 'border-red-400' : 'border-slate-200 focus:border-gold'} rounded-xl py-3 px-4 text-slate-800 text-sm focus:outline-none transition-colors`}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1" />{errors.phone}</p>}
                  </div>
                </div>

                {/* Email (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email Address (Optional)</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g., sanjay@gmail.com"
                    className="w-full bg-white border border-slate-200 focus:border-gold rounded-xl py-3 px-4 text-slate-800 text-sm focus:outline-none transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Your Travel Requirements</label>
                  <textarea 
                    rows="4"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write details like: Pickup date, route, number of passenger seats needed, etc."
                    className={`w-full bg-white border ${errors.message ? 'border-red-400' : 'border-slate-200 focus:border-gold'} rounded-xl py-3 px-4 text-slate-800 text-sm focus:outline-none transition-colors resize-none`}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1 flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1" />{errors.message}</p>}
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 bg-gold hover:bg-gold-dark text-navy-dark font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg shadow-gold/20"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Inquiry Message
                </button>
              </form>
            </div>

            {/* Right side Map */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="flex-grow bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative shadow-md min-h-[350px]">
                {/* Premium Mock Map Visual Graphics */}
                <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  {/* Mock grid lines & vector points */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold/5 rounded-full border border-gold/10 animate-pulse-slow" />
                  
                  <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center relative">
                    <span className="absolute inset-0 rounded-full border border-gold animate-ping opacity-30" />
                    <MapPin className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-1.5 z-10">
                    <h3 className="text-white font-bold text-lg">Shiv Tours & Travels Office</h3>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                      Building No 01, Anay Coop Housing Society Ltd, Near Prasad Mangal Karyalay, D. K. Nagar, Nashik, Maharashtra 422013
                    </p>
                  </div>

                  <a 
                    href="https://www.google.com/maps/place/Shiv+Tours+And+Travels/@20.0166362,73.7617188,17z/data=!4m14!1m7!3m6!1s0x3bddeba232f6a8bb:0xbbc6314cfb9b277b!2sShiv+Tours+And+Travels!8m2!3d20.0166362!4d73.7617188!16s%2Fg%2F11xcngthdz!3m5!1s0x3bddeba232f6a8bb:0xbbc6314cfb9b277b!8m2!3d20.0166362!4d73.7617188!16s%2Fg%2F11xcngthdz?hl=en-IN&entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-gold hover:bg-gold-dark text-navy-dark font-bold text-xs rounded-xl shadow-md transition-colors inline-block z-10"
                  >
                    Open Live Google Maps
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
