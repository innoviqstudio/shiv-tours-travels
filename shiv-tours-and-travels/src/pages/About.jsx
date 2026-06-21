import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Heart, Users, Award, Smile, Compass } from 'lucide-react';

const About = () => {
  const values = [
    { title: 'Customer Safety First', desc: 'Your safety is our top priority. We verify all drivers and keep our cars in perfect condition.', icon: ShieldCheck },
    { title: 'Friendly Service', desc: 'We treat our customers like family. Our drivers are polite, helpful, and speak local languages.', icon: Heart },
    { title: 'Honest Pricing', desc: 'What you see is what you pay. We do not have any hidden fees or extra holiday charges.', icon: Award },
    { title: 'Clean & Sanitized Cabs', desc: 'We clean and disinfect every car before it reaches your doorstep for a healthy trip.', icon: Smile }
  ];

  const stats = [
    { value: '3+', label: 'Years Experience' },
    { value: '5,000+', label: 'Happy Customers' },
    { value: '50+', label: 'Well-Maintained Cars' },
    { value: '100%', label: 'On-Time Pickups' }
  ];

  return (
    <div className="pt-24 bg-slate-50">
      {/* 1. Header Banner */}
      <section className="relative bg-navy py-16 text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80" 
            alt="Scenic Travel Banner" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-navy/85" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold"
          >
            About Us
          </motion.h1>
          <p className="text-slate-300 mt-3 max-w-lg mx-auto text-sm sm:text-base">
            Know more about Shiv Tours & Travels, your trusted travel partner in Nashik and Maharashtra.
          </p>
        </div>
      </section>

      {/* 2. Company Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-sm font-bold tracking-widest text-gold uppercase block">Our History</span>
              <h2 className="text-3xl font-extrabold text-navy-dark">
                Serving Travelers Since 2023 With Trust and Comfort
              </h2>
              <div className="h-1 w-16 bg-gold rounded-full" />
              <p className="text-slate-600 leading-relaxed text-base">
                Shiv Tours & Travels started with a simple goal: to make outstation travel easy, safe, and affordable for everyone in Nashik. Since 2023, we have grown to a premium travel agency with a fleet of cars serving customers across Maharashtra.
              </p>
              <p className="text-slate-600 leading-relaxed text-base">
                We believe that travel is not just about moving from one place to another. It is about creating beautiful memories with your family. That is why we focus on well-maintained cars and highly professional local drivers who know the roads perfectly.
              </p>
              <div className="border-l-4 border-gold pl-4 italic text-slate-500 font-medium">
                "We don't just drive you. We take care of you throughout your journey."
              </div>
            </div>

            {/* Right side Image card */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-gold to-navy rounded-3xl opacity-10 blur-lg" />
              <div className="relative bg-navy rounded-3xl overflow-hidden shadow-2xl border border-gold/20">
                <img 
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80" 
                  alt="Shiv Travels Fleet" 
                  className="w-full h-80 object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                  <span className="text-gold font-bold text-lg block">Shiv Tours & Travels</span>
                  <span className="text-xs text-slate-300">Your Journey, Our Commitment</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Experience Stats Banner */}
      <section className="py-16 bg-navy text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-gold block">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm text-slate-300 block tracking-wide uppercase font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Our Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-gold/10 text-gold rounded-xl flex items-center justify-center mb-2">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-navy-dark">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                To provide a premium and comfortable travel experience at local Indian prices. We strive to be the most trusted travel agency in Maharashtra by keeping our cars clean, our drivers reliable, and our pricing transparent.
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-navy/10 text-navy rounded-xl flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-2xl font-bold text-navy-dark">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                To expand our tour packages and vehicle fleet, creating a seamless digital booking experience while preserving our local personal touch. We want to be the first choice for every family planning a journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Core Values */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-bold tracking-widest text-gold uppercase block">Values We Believe In</span>
            <h2 className="text-3xl font-extrabold text-navy-dark">
              Why Our Customers Trust Us
            </h2>
            <div className="h-1 w-16 bg-gold mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center">
                  <val.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-dark">{val.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
