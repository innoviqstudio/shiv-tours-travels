import React from 'react';
import { Phone, Mail, MapPin, Compass } from 'lucide-react';

const Footer = ({ setCurrentPage }) => {
  const handleNavClick = (id) => {
    setCurrentPage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-navy-dark text-slate-300 border-t border-gold/10">
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
              <img 
                className="h-12 w-12 rounded-full border-2 border-gold object-cover" 
                src="/logo.jpg" 
                alt="Shiv Travels Logo"
              />
              <div className="ml-3">
                <span className="text-xl font-bold tracking-wide text-white block">
                  SHIV <span className="text-gold">TRAVELS</span>
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-slate-400 block -mt-1">
                  Tours & Travels
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed pt-2">
              Safe, comfortable, and reliable travel services. Book your next trip across Maharashtra with our trusted drivers and well-maintained premium vehicles.
            </p>
            <div className="flex space-x-4 pt-2">
              {/* Instagram Icon Inline SVG */}
              <a 
                href="https://www.instagram.com/shiv_tours_and_travels_mh15?igsh=MWd0M3djMjMxaDE5" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-gold transition-colors duration-200" 
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* WhatsApp Icon Inline SVG */}
              <a 
                href="https://wa.me/918010936793?text=Hello%20Shiv%20Travels,%20I%20want%20to%20enquire%20about%20a%20cab%20booking." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-gold transition-colors duration-200" 
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.29 1.988 13.8 1.947 11.16 1.947c-5.438 0-9.863 4.37-9.867 9.8-.001 1.993.523 3.941 1.517 5.679L1.87 21.082l3.967-.999c1.7.929 3.082 1.439 4.81 1.071zm15.658-6.173c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.669.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base tracking-wider uppercase mb-6 flex items-center">
              <Compass className="w-4 h-4 mr-2 text-gold" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { id: 'home', label: 'Home Page' },
                { id: 'about', label: 'About Us' },
                { id: 'vehicles', label: 'Our Vehicles' },
                { id: 'packages', label: 'Tour Packages' },
                { id: 'reviews', label: 'Customer Reviews' },
                { id: 'contact', label: 'Contact Us' },
                { id: 'admin', label: 'Admin Dashboard' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className="text-sm hover:text-gold transition-colors duration-200 text-slate-400 text-left"
                  >
                    &rarr; {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-base tracking-wider uppercase mb-6 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gold" />
              Get In Touch
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-gold mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-400">
                  <a href="tel:+919405601603" className="hover:text-gold block transition-colors">
                    +91 9405601603
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-gold mr-3 flex-shrink-0 mt-0.5" />
                <a href="mailto:info@shivtoursandtravels.com" className="text-sm text-slate-400 hover:text-gold transition-colors break-all">
                  info@shivtoursandtravels.com
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-gold mr-3 flex-shrink-0 mt-0.5" />
                <a 
                  href="https://www.google.com/maps/place/Shiv+Tours+And+Travels/@20.0166362,73.7617188,17z/data=!4m14!1m7!3m6!1s0x3bddeba232f6a8bb:0xbbc6314cfb9b277b!2sShiv+Tours+And+Travels!8m2!3d20.0166362!4d73.7617188!16s%2Fg%2F11xcngthdz!3m5!1s0x3bddeba232f6a8bb:0xbbc6314cfb9b277b!8m2!3d20.0166362!4d73.7617188!16s%2Fg%2F11xcngthdz?hl=en-IN&entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 hover:text-gold transition-colors leading-relaxed"
                >
                  Building No 01, Anay Coop Housing Society Ltd, Near Prasad Mangal Karyalay, D. K. Nagar, Nashik, Maharashtra 422013
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Quality Commitment */}
          <div>
            <h3 className="text-white font-semibold text-base tracking-wider uppercase mb-6">
              Our Promise
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              We focus on providing the best travel experience. Our cabs are clean, drivers are experienced, and prices are simple with no hidden charges.
            </p>
            <div className="bg-navy-light/40 border border-gold/15 p-4 rounded-xl">
              <span className="text-xs text-gold uppercase tracking-widest font-semibold block mb-1">
                24/7 WhatsApp Helpline
              </span>
              <a href="https://wa.me/918010936793" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:text-gold transition-colors">
                +91 8010936793
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="bg-navy-dark border-t border-slate-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-slate-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} Shiv Tours & Travels. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 text-center md:text-right mt-2 md:mt-0">
            Designed for comfort and reliability.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
