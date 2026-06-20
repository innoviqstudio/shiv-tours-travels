import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { 
  Car, Calendar, Clock, MapPin, Phone, ArrowRight, ShieldCheck, 
  Award, ThumbsUp, Star, Users, MessageSquare, BadgePercent,
  CheckCircle2, AlertCircle
} from 'lucide-react';

const Home = ({ setCurrentPage, setBookingData, openPayment }) => {
  const [formData, setFormData] = useState({
    pickup: '',
    drop: '',
    date: '',
    time: '',
    vehicleType: 'Sedan (Dzire/Etios)',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const services = [
    { title: 'Airport Pickup & Drop', desc: 'On-time pickup and drop service for Mumbai and Pune airports.', icon: Car, tag: 'Reliable' },
    { title: 'Local Cab Service', desc: 'Hourly rentals for local sightseeing and shopping in Nashik.', icon: Clock, tag: 'Flexible' },
    { title: 'Outstation Trips', desc: 'One-way and round-trip journeys across Maharashtra and nearby states.', icon: MapPin, tag: 'Popular' },
    { title: 'Family Tours', desc: 'Comfortable long journeys for family gatherings and holidays.', icon: Users, tag: 'Safe' },
    { title: 'Holiday Packages', desc: 'Complete tour packages including Shirdi, Nashik, and Konkan.', icon: Award, tag: 'Exciting' },
    { title: 'Corporate Travel', desc: 'Professional travel service for businesses, meetings, and events.', icon: ShieldCheck, tag: 'Premium' }
  ];

  const whyChooseUs = [
    { title: 'Professional Drivers', desc: 'Experienced, polite, and verified local drivers who know all the routes.', icon: Award },
    { title: 'Safe Journey', desc: 'Well-maintained GPS-tracked cars with full safety features for your family.', icon: ShieldCheck },
    { title: 'Affordable Prices', desc: 'Best rates with transparent pricing and absolutely no hidden charges.', icon: BadgePercent },
    { title: 'Clean Vehicles', desc: 'Every car is thoroughly cleaned and sanitized before every trip.', icon: CheckCircle2 },
    { title: '24x7 Service', desc: 'Round-the-clock booking and emergency road support whenever you travel.', icon: ThumbsUp },
    { title: 'On-Time Pickup', desc: 'We respect your time. Our driver will always arrive before your scheduled time.', icon: Clock }
  ];

  const previewVehicles = [
    {
      name: 'Sedan (Dzire / Aura / Xcent)',
      type: 'Sedan',
      seats: '4+1 Seats',
      ac: 'AC Car Only',
      rate: '₹13/km',
      desc: 'Comfortable outstation sedan for small groups.',
      img: '/dzire.png'
    },
    {
      name: 'Maruti Suzuki Ertiga',
      type: 'SUV',
      seats: '6+1 Seats',
      ac: 'AC Car Only',
      rate: '₹16/km',
      desc: 'Most popular family SUV for comfortable group travel.',
      img: '/ertiga.png'
    },
    {
      name: 'Toyota Innova Crysta',
      type: 'Premium SUV',
      seats: '7+1 Seats',
      ac: 'AC Car Only',
      rate: '₹22/km',
      desc: 'Premium luxury MUV with ultimate riding comfort.',
      img: '/innovacrysta.png'
    }
  ];

  const previewPackages = [
    {
      title: 'Shirdi Darshan Tour',
      duration: '1 Day Trip',
      price: 'Starting from ₹2,999',
      desc: 'Peaceful spiritual journey from Nashik/Mumbai to Shirdi Sai Baba Temple.',
      img: '/shirdi.png'
    },
    {
      title: 'Nashik Vineyards & Temples',
      duration: 'Weekend Special',
      price: 'Starting from ₹3,499',
      desc: 'Explore Sula Vineyards, Trimbakeshwar Temple, and Panchavati.',
      img: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Mumbai & Pune Airport Transfers',
      duration: 'Fixed Rates',
      price: 'Starting from ₹3,999',
      desc: 'Stress-free direct pickup or drop service right to the airport terminal.',
      img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const previewReviews = [
    { name: 'Nilesh Gade', rating: 5, comment: 'I have used Shiv Tours and Travels on multiple occasions. On each journey the service was of top level. All the driving staff were extremely polite and very professional.' },
    { name: 'Suraj Chaudhari', rating: 5, comment: 'Excellent service. Clean car and the driver was very courteous. Our driver was rushikesh chaudhari.' },
    { name: 'Kapil Gaikwad', rating: 5, comment: 'Driver n driving was so good. Happy with shiv tours and travels.' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.pickup.trim()) newErrors.pickup = 'Pickup location is required';
    if (!formData.drop.trim()) newErrors.drop = 'Drop location is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit number';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setBookingData(formData);
      setShowModal(true);
    }
  };

  const triggerWhatsApp = async () => {
    // Prepare booking object for database
    const amountVal = formData.vehicleType.toLowerCase().includes('sedan') ? 2200 : formData.vehicleType.toLowerCase().includes('suv') ? 3500 : 5500;
    const bookingRecord = {
      customerName: `Customer (${formData.phone})`,
      phone: formData.phone,
      pickup: formData.pickup,
      drop: formData.drop,
      date: formData.date,
      time: formData.time,
      vehicleType: formData.vehicleType,
      amount: amountVal,
      paidAmount: 0,
      balanceAmount: amountVal,
      paymentMethod: 'WhatsApp',
      status: 'Pending',
      bookingType: 'whatsapp'
    };

    try {
      await axios.post('/api/bookings', bookingRecord);
    } catch (err) {
      console.error('Failed to log WhatsApp booking to database:', err);
    }

    const text = `*New Booking Request - Shiv Travels*\n\n` +
                 `📍 *Pickup:* ${formData.pickup}\n` +
                 `🏁 *Drop:* ${formData.drop}\n` +
                 `📅 *Date:* ${formData.date}\n` +
                 `🕒 *Time:* ${formData.time}\n` +
                 `🚗 *Vehicle:* ${formData.vehicleType}\n` +
                 `📱 *Phone:* ${formData.phone}\n\n` +
                 `Please confirm my booking. Thank you!`;
    const whatsappUrl = `https://wa.me/918010936793?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    setShowModal(false);
  };

  return (
    <div className="relative">
      {/* 1. HERO SECTION */}
      <div className="relative min-h-[90vh] flex items-center bg-navy py-20 overflow-hidden">
        {/* Dynamic Background Image with Navy Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1626014303757-6fcbe6a53596?auto=format&fit=crop&w=1600&q=80" 
            alt="Scenic road travel in India" 
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy/90 to-navy/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side text */}
            <div className="lg:col-span-7 text-white text-center lg:text-left space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/30 px-4 py-1.5 rounded-full text-gold text-sm font-semibold"
              >
                <Star className="w-4 h-4 fill-gold" />
                <span>#1 Trusted Cab Service in Nashik & Maharashtra</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
              >
                Safe, Comfortable and <br />
                <span className="gold-text-gradient">Reliable Cabs</span> Services
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
              >
                Book your trip with trusted drivers and well-maintained vehicles. Clean cars, transparent pricing, and 24/7 travel support for your peace of mind.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
              >
                <button 
                  onClick={() => {
                    const el = document.getElementById('booking-form-box');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold-dark text-navy-dark font-bold rounded-xl shadow-lg shadow-gold/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
                >
                  Book Cabs Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <a 
                  href="https://wa.me/918010936793?text=Hi,%20I%20want%20to%20enquire%20about%20a%20car%20rental."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 border-2 border-slate-300 hover:border-gold hover:text-gold text-slate-100 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center bg-white/5 backdrop-blur-sm"
                >
                  WhatsApp Enquiry
                </a>
              </motion.div>
            </div>

            {/* Right side Booking Form */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              id="booking-form-box" 
              className="lg:col-span-5 w-full bg-navy-dark/80 backdrop-blur-lg border border-gold/25 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50"
            >
              <h2 className="text-2xl font-bold text-white text-center mb-1">
                Quick Booking Form
              </h2>
              <p className="text-xs text-slate-400 text-center mb-6">
                Enter your details to request an instant call-back and confirmation.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Pickup Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Pickup Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gold" />
                    <input 
                      type="text" 
                      name="pickup" 
                      value={formData.pickup} 
                      onChange={handleChange}
                      placeholder="e.g., Nashik Road, Mumbai Airport" 
                      className={`w-full bg-navy-light/50 border ${errors.pickup ? 'border-red-500' : 'border-slate-700 hover:border-gold/50'} focus:border-gold rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none transition-colors`}
                    />
                  </div>
                  {errors.pickup && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1" />{errors.pickup}</p>}
                </div>

                {/* Drop Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Drop Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gold" />
                    <input 
                      type="text" 
                      name="drop" 
                      value={formData.drop} 
                      onChange={handleChange}
                      placeholder="e.g., Shirdi, Pune, Mumbai Cabs" 
                      className={`w-full bg-navy-light/50 border ${errors.drop ? 'border-red-500' : 'border-slate-700 hover:border-gold/50'} focus:border-gold rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none transition-colors`}
                    />
                  </div>
                  {errors.drop && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1" />{errors.drop}</p>}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Travel Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gold" />
                      <input 
                        type="date" 
                        name="date" 
                        value={formData.date} 
                        onChange={handleChange}
                        className={`w-full bg-navy-light/50 border ${errors.date ? 'border-red-500' : 'border-slate-700 hover:border-gold/50'} focus:border-gold rounded-xl py-3 pl-10 pr-3 text-white text-sm focus:outline-none transition-colors [color-scheme:dark]`}
                      />
                    </div>
                    {errors.date && <p className="text-xs text-red-400 mt-1 flex items-center">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Pickup Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3.5 h-5 w-5 text-gold" />
                      <input 
                        type="time" 
                        name="time" 
                        value={formData.time} 
                        onChange={handleChange}
                        className={`w-full bg-navy-light/50 border ${errors.time ? 'border-red-500' : 'border-slate-700 hover:border-gold/50'} focus:border-gold rounded-xl py-3 pl-10 pr-3 text-white text-sm focus:outline-none transition-colors [color-scheme:dark]`}
                      />
                    </div>
                    {errors.time && <p className="text-xs text-red-400 mt-1 flex items-center">{errors.time}</p>}
                  </div>
                </div>

                {/* Vehicle Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Select Vehicle Type
                  </label>
                  <div className="relative">
                    <Car className="absolute left-3 top-3.5 h-5 w-5 text-gold" />
                    <select 
                      name="vehicleType" 
                      value={formData.vehicleType} 
                      onChange={handleChange}
                      className="w-full bg-navy-light/50 border border-slate-700 hover:border-gold/50 focus:border-gold rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option className="bg-navy" value="Sedan (Dzire/Etios)">Sedan (Dzire/Etios) - 4+1 Seater</option>
                      <option className="bg-navy" value="SUV (Ertiga)">SUV (Ertiga) - 6+1 Seater</option>
                      <option className="bg-navy" value="Premium SUV (Innova Crysta)">Premium SUV (Innova Crysta)</option>
                      <option className="bg-navy" value="Tempo Traveller">Tempo Traveller - 13/17 Seater</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gold">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gold" />
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange}
                      placeholder="Enter 10-digit Mobile Number" 
                      className={`w-full bg-navy-light/50 border ${errors.phone ? 'border-red-500' : 'border-slate-700 hover:border-gold/50'} focus:border-gold rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none transition-colors`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1" />{errors.phone}</p>}
                </div>

                {/* Submit button */}
                <button 
                  type="submit" 
                  className="w-full py-4 mt-2 bg-gradient-to-r from-gold via-gold-light to-gold hover:from-gold-dark hover:to-gold text-navy-dark font-bold text-base rounded-xl transition-all duration-300 shadow-lg shadow-gold/20 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center cursor-pointer"
                >
                  <Car className="w-5 h-5 mr-2" />
                  Book Your Ride Now
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </div>

      {/* 2. SERVICES SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-bold tracking-widest text-gold uppercase block mb-2">Our Services</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-dark tracking-tight">
              Best Cabs Services For All Your Travel Needs
            </h2>
            <div className="h-1 w-20 bg-gold mx-auto mt-4 rounded-full" />
            <p className="text-base text-slate-500 mt-4 leading-relaxed">
              We offer premium travel solutions. From airport transfers to customized weekend tour packages, we guarantee comfort and style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={index}
                className="group p-8 bg-slate-50 hover:bg-navy border border-slate-100 hover:border-gold/30 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-start"
              >
                <div className="p-4 bg-gold/10 text-gold rounded-xl group-hover:bg-gold group-hover:text-navy-dark transition-all duration-300 mb-6">
                  <service.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200/60 text-slate-600 group-hover:bg-gold/20 group-hover:text-gold transition-colors mb-3">
                  {service.tag}
                </span>
                <h3 className="text-xl font-bold text-navy-dark group-hover:text-white transition-colors mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-500 group-hover:text-slate-300 transition-colors leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. VEHICLES PREVIEW SECTION */}
      <section className="py-24 bg-slate-50 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16">
            <div>
              <span className="text-sm font-bold tracking-widest text-gold uppercase block mb-2">Our Premium Fleet</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-dark tracking-tight">
                Choose Your Comfortable Vehicle
              </h2>
              <div className="h-1 w-20 bg-gold mt-4 rounded-full" />
            </div>
            <button 
              onClick={() => setCurrentPage('vehicles')}
              className="mt-6 md:mt-0 inline-flex items-center text-gold hover:text-gold-dark font-bold transition-all text-base group"
            >
              View All Vehicles
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {previewVehicles.map((vehicle, index) => (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                key={index}
                className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-50 flex items-center justify-center">
                  <img 
                    src={vehicle.img} 
                    alt={vehicle.name} 
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 right-4 bg-navy-dark/80 text-gold text-xs font-bold px-3 py-1 rounded-full border border-gold/20">
                    {vehicle.type}
                  </span>
                </div>
                <div className="p-6 sm:p-8 space-y-4">
                  <h3 className="text-xl font-bold text-navy-dark">
                    {vehicle.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                      {vehicle.seats}
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                      {vehicle.ac}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {vehicle.desc}
                  </p>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Rate</span>
                      <span className="text-lg font-extrabold text-navy">{vehicle.rate}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setFormData({ ...formData, vehicleType: vehicle.name.includes('Dzire') ? 'Sedan (Dzire/Etios)' : vehicle.name.includes('Ertiga') ? 'SUV (Ertiga)' : 'Premium SUV (Innova Crysta)' });
                        const el = document.getElementById('booking-form-box');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-5 py-2.5 bg-gold hover:bg-gold-dark text-navy-dark font-bold text-sm rounded-xl shadow-md transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-24 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-sm font-bold tracking-widest text-gold uppercase block mb-2">Why Travel With Us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              We Offer The Best Experience
            </h2>
            <div className="h-1 w-20 bg-gold mx-auto mt-4 rounded-full" />
            <p className="text-base text-slate-400 mt-4 leading-relaxed">
              Customer satisfaction is our first goal. We ensure your journeys are smooth, fast, and completely safe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                key={index}
                className="bg-navy-light/40 border border-slate-700/40 p-8 rounded-2xl flex items-start space-x-4 hover:border-gold/30 hover:bg-navy-light/60 transition-all duration-300"
              >
                <div className="p-3 bg-gold/10 text-gold rounded-xl flex-shrink-0">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TOUR PACKAGES PREVIEW SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16">
            <div>
              <span className="text-sm font-bold tracking-widest text-gold uppercase block mb-2">Popular Tours</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-dark tracking-tight">
                Explore Maharashtra Tour Packages
              </h2>
              <div className="h-1 w-20 bg-gold mt-4 rounded-full" />
            </div>
            <button 
              onClick={() => setCurrentPage('packages')}
              className="mt-6 md:mt-0 inline-flex items-center text-gold hover:text-gold-dark font-bold transition-all text-base group"
            >
              View All Packages
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {previewPackages.map((pack, index) => (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                key={index}
                className="bg-slate-50 border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img 
                    src={pack.img} 
                    alt={pack.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 bg-gold text-navy-dark text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {pack.duration}
                  </span>
                </div>
                <div className="p-6 sm:p-8 space-y-4 flex flex-col flex-grow justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-navy-dark">
                      {pack.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {pack.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-sm font-bold text-navy">{pack.price}</span>
                    <button 
                      onClick={() => {
                        setFormData({ 
                          ...formData, 
                          pickup: 'Nashik', 
                          drop: pack.title.includes('Shirdi') ? 'Shirdi Sai Baba Temple' : pack.title.includes('Vineyards') ? 'Nashik Vineyards' : 'Mumbai Airport'
                        });
                        const el = document.getElementById('booking-form-box');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center text-xs font-bold text-gold hover:text-gold-dark"
                    >
                      Book Tour <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS SECTION */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16">
            <div>
              <span className="text-sm font-bold tracking-widest text-gold uppercase block mb-2">Testimonials</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-dark tracking-tight">
                What Our Customers Say About Us
              </h2>
              <div className="h-1 w-20 bg-gold mt-4 rounded-full" />
            </div>
            <button 
              onClick={() => setCurrentPage('reviews')}
              className="mt-6 md:mt-0 inline-flex items-center text-gold hover:text-gold-dark font-bold transition-all text-base group"
            >
              Read All Reviews
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {previewReviews.map((rev, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={index}
                className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm relative space-y-4"
              >
                <div className="flex items-center space-x-1 text-gold">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-500 italic leading-relaxed">
                  "{rev.comment}"
                </p>
                <div className="pt-4 border-t border-slate-100 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-navy/10 text-navy font-bold flex items-center justify-center">
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-navy-dark block">{rev.name}</span>
                    <span className="text-xs text-slate-400 block">Verified Traveler</span>
                  </div>
                </div>
                <MessageSquare className="w-12 h-12 text-slate-100 absolute bottom-4 right-6 -z-0 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION (CTA) SECTION */}
      <section className="py-20 bg-gradient-to-r from-navy via-navy-light to-navy-dark text-white relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready for Your Next Journey?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-base">
            Get in touch with us today. Book safe, reliable, and premium cabs for your next family tour or airport trip.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a 
              href="tel:+919405601603"
              className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold-dark text-navy-dark font-bold rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg shadow-gold/20"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Now: +91 9405601603
            </a>
            <a 
              href="https://wa.me/918010936793?text=Hello%20Shiv%20Travels,%20I%20want%20to%20enquire%20about%20a%20cab%20booking."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 border border-slate-500 hover:border-gold hover:text-gold text-slate-100 font-semibold rounded-xl transition-all bg-white/5 backdrop-blur-sm"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* 8. CONFIRMATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-gold/20 shadow-2xl relative">
            <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-navy-dark text-center mb-2">
              Confirm Your Request
            </h3>
            <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
              We will prepare your booking details. Click below to instantly send this details to us on WhatsApp and get confirmation.
            </p>
            
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm space-y-2.5 mb-6 text-navy-dark">
              <div><span className="font-semibold text-slate-400 text-xs uppercase block">Pickup:</span> {formData.pickup}</div>
              <div><span className="font-semibold text-slate-400 text-xs uppercase block">Drop:</span> {formData.drop}</div>
              <div><span className="font-semibold text-slate-400 text-xs uppercase block">Date & Time:</span> {formData.date} at {formData.time}</div>
              <div><span className="font-semibold text-slate-400 text-xs uppercase block">Vehicle Type:</span> {formData.vehicleType}</div>
              <div><span className="font-semibold text-slate-400 text-xs uppercase block">Phone Number:</span> {formData.phone}</div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                type="button"
                onClick={() => {
                  setShowModal(false);
                  const amountVal = formData.vehicleType.toLowerCase().includes('sedan') ? 2200 : formData.vehicleType.toLowerCase().includes('suv') ? 3500 : 5500;
                  setBookingData({
                    vehicleName: formData.vehicleType,
                    pickup: formData.pickup,
                    drop: formData.drop,
                    date: formData.date,
                    time: formData.time,
                    amount: amountVal,
                    phone: formData.phone,
                    customerName: `Customer (${formData.phone})`
                  });
                  openPayment();
                }}
                className="w-full py-3.5 bg-gold hover:bg-gold-dark text-navy-dark font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center cursor-pointer text-sm"
              >
                Confirm & Pay Online (₹500 Token)
              </button>
              <button 
                type="button"
                onClick={triggerWhatsApp}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition-all cursor-pointer text-center text-sm"
              >
                Book Directly via WhatsApp (No Payment)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
