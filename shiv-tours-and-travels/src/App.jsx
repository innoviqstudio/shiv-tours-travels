import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import PaymentModal from './components/PaymentModal';

// Import Pages
import Home from './pages/Home';
import About from './pages/About';
import Vehicles from './pages/Vehicles';
import Packages from './pages/Packages';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [bookingData, setBookingData] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Render the current active page component
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home 
            setCurrentPage={setCurrentPage} 
            setBookingData={setBookingData} 
            openPayment={() => setIsPaymentOpen(true)} 
          />
        );
      case 'about':
        return <About />;
      case 'vehicles':
        return (
          <Vehicles 
            setBookingData={setBookingData} 
            openPayment={() => setIsPaymentOpen(true)} 
          />
        );
      case 'packages':
        return (
          <Packages 
            setBookingData={setBookingData} 
            openPayment={() => setIsPaymentOpen(true)} 
          />
        );
      case 'reviews':
        return <Reviews />;
      case 'contact':
        return <Contact />;
      case 'admin':
        return <Admin />;
      default:
        return (
          <Home 
            setCurrentPage={setCurrentPage} 
            setBookingData={setBookingData} 
            openPayment={() => setIsPaymentOpen(true)} 
          />
        );
    }
  };

  // Define transition animation variants for pages
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
        ease: 'easeIn'
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Sticky Top Header Navigation */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main Content Area with transition animations */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Call & WhatsApp Buttons */}
      <FloatingActions />

      {/* Global Payment Checkout Gateway Modal */}
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        bookingData={bookingData} 
      />

      {/* Footer Links & Contact Info */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default App;
