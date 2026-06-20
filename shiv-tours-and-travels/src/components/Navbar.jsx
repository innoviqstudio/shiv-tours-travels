import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        isScrolled || setIsScrolled(true);
      } else {
        !isScrolled || setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'vehicles', label: 'Vehicles' },
    { id: 'packages', label: 'Tour Packages' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'admin', label: 'Admin' }
  ];

  const handleNavClick = (id) => {
    setCurrentPage(id);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-navy-dark/95 shadow-lg shadow-black/10 py-3 border-b border-gold/10' 
        : 'bg-navy/80 backdrop-blur-md py-4 border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
            <img 
              className="h-12 w-12 rounded-full border-2 border-gold object-cover shadow-md shadow-gold/20" 
              src="/logo.jpg" 
              alt="Shiv Travels Logo"
              onError={(e) => {
                // Fallback icon placeholder if logo image has pathing issues
                e.target.style.display = 'none';
              }}
            />
            <div className="ml-3">
              <span className="text-xl font-bold tracking-wide text-white block">
                SHIV <span className="text-gold">TRAVELS</span>
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-slate-300 block -mt-1">
                Tours & Travels
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-colors duration-200 relative py-2 ${
                  currentPage === item.id 
                    ? 'text-gold' 
                    : 'text-slate-200 hover:text-gold'
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Call Now CTA Button */}
          <div className="hidden sm:block">
            <a
              href="tel:+919405601603"
              className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border border-gold text-gold hover:bg-gold hover:text-navy shadow-md hover:shadow-gold/20 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white hover:bg-navy-light focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6 text-gold" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'} overflow-hidden bg-navy-dark/95 border-b border-gold/10`}>
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium transition-colors ${
                currentPage === item.id 
                  ? 'bg-gold/10 text-gold font-semibold' 
                  : 'text-slate-300 hover:bg-navy-light/50 hover:text-gold'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 pb-2 border-t border-slate-700/50 px-3">
            <a
              href="tel:+919405601603"
              className="w-full flex items-center justify-center py-3 px-4 rounded-full text-center text-sm font-semibold border border-gold text-gold hover:bg-gold hover:text-navy transition-all"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now: +91 9405601603
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
