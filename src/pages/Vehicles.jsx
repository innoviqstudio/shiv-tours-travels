import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Users, Check, AlertCircle, Info, Sparkles } from 'lucide-react';
import { API } from '../api';

const Vehicles = ({ setBookingData, openPayment }) => {
  const [distance, setDistance] = useState(100);
  const [tripType, setTripType] = useState('round'); // round or oneway
  const [acType, setAcType] = useState('ac'); // ac or nonac
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const defaultFleet = [
    {
      id: 1,
      name: 'Sedan (Dzire / Aura / Xcent)',
      type: 'Sedan (4+1)',
      seats: 4,
      ac: 'AC Car Only',
      rate: 13,
      luggage: '2 Large Bags',
      features: ['GPS Navigation', 'Music System', 'USB Charging Port', 'Verified Driver'],
      bestFor: 'Perfect for small families, solo travelers, and short outstation trips.',
      img: '/dzire.png'
    },
    {
      id: 2,
      name: 'Maruti Ertiga / Toyota Rumion',
      type: 'SUV (6+1)',
      seats: 6,
      ac: 'AC Car Only',
      rate: 16,
      luggage: '3-4 Bags',
      features: ['Roof Carrier Available', 'Spacious Cabin', 'Music System', 'USB Charging Port'],
      bestFor: 'Best for medium families, group trips, and pilgrimage tours.',
      img: '/ertiga.png'
    },
    {
      id: 3,
      name: 'Kia Carens',
      type: 'Premium SUV (6+1)',
      seats: 6,
      ac: 'AC Car Only',
      rate: 17,
      luggage: '3 Bags',
      features: ['Captain Seats', 'Premium Interior', 'USB Charging in all rows', 'Polite Driver'],
      bestFor: 'Modern comfort and premium look for family vacations.',
      img: '/carens.png'
    },
    {
      id: 4,
      name: 'Toyota Innova',
      type: 'Comfort MUV (7+1)',
      seats: 7,
      ac: 'AC Car Only',
      rate: 19,
      luggage: '4 Bags',
      features: ['Extremely Reliable', 'Spacious Seats', 'Dual AC', 'Polite Local Driver'],
      bestFor: 'Highly comfortable and reliable family outstation travel.',
      img: '/innova.png'
    },
    {
      id: 5,
      name: 'Toyota Innova Crysta',
      type: 'Luxury MUV (7+1)',
      seats: 7,
      ac: 'AC Car Only',
      rate: 22,
      luggage: '4 Large Bags',
      features: ['Premium Captain Seats', 'Automatic Climate Control', 'Premium Sound System', 'Roof Carrier Available'],
      bestFor: 'The ultimate luxury travel for long outstation trips and business meetings.',
      img: '/innovacrysta.png'
    },
    {
      id: 6,
      name: 'Tata Winger (12 Seater)',
      type: 'Tempo (12+1)',
      seats: 12,
      ac: 'AC & Non-AC Available',
      rate: 22, // Non-AC
      rateAc: 25, // AC
      luggage: '6+ Bags + Roof Carrier',
      features: ['Spacious Standup Cabin', 'Individual AC Vents', 'Music System', 'Perfect for Group Tours'],
      bestFor: 'Perfect for group trips, family picnics, and wedding parties.',
      img: '/winger.jpg'
    },
    {
      id: 7,
      name: 'Tempo Traveller (14 Seater)',
      type: 'Luxury Van (14+1)',
      seats: 14,
      ac: 'AC & Non-AC Available',
      rate: 25, // Non-AC
      rateAc: 30, // AC
      luggage: '8+ Bags + Roof Carrier',
      features: ['Pushback Seats', 'Music System & Screen', 'Excellent Legroom', 'Comfortable Suspension'],
      bestFor: 'Best for pilgrim groups, medium tourist groups, and marriages.',
      img: '/tempotraveller.png'
    },
    {
      id: 8,
      name: 'Tempo Traveller (17 Seater)',
      type: 'Luxury Van (17+1)',
      seats: 17,
      ac: 'AC & Non-AC Available',
      rate: 30, // Non-AC
      rateAc: 35, // AC
      luggage: '10+ Bags + Roof Carrier',
      features: ['Pushback Seats', 'Music System', 'LED Screen', 'Luggage Carrier'],
      bestFor: 'Large families, pilgrim groups, and outstation tours.',
      img: '/tempotraveller.png'
    },
    {
      id: 9,
      name: 'Tempo Traveller (20 Seater)',
      type: 'Luxury Van (20+1)',
      seats: 20,
      ac: 'AC & Non-AC Available',
      rate: 35, // Non-AC
      rateAc: 40, // AC
      luggage: '12+ Bags + Roof Carrier',
      features: ['Comfortable Pushback Seats', 'Spacious Aisle', 'Screen & Mic System', 'Roof Carrier'],
      bestFor: 'Large groups, wedding guests, and corporate events.',
      img: '/tempotraveller.png'
    },
    {
      id: 10,
      name: 'Tempo Traveller (26 Seater)',
      type: 'Luxury Bus (26+1)',
      seats: 26,
      ac: 'AC & Non-AC Available',
      rate: 40, // Non-AC
      rateAc: 45, // AC
      luggage: '15+ Bags + Roof Carrier',
      features: ['Wide Body Design', 'Premium Pushback Seats', 'LED TV Screen', 'Ample Trunk Space'],
      bestFor: 'Very large groups, tour operators, and wedding transport.',
      img: '/tempotraveller.png'
    },
    {
      id: 11,
      name: 'Force Urbania (Premium)',
      type: 'VIP Luxury MUV',
      seats: 17,
      ac: 'AC Car Only',
      rate: 45,
      luggage: 'Huge Luggage space',
      features: ['Ultra Premium Recliner Seats', 'Individual AC Vents & USB Ports', 'Panoramic Windows', 'Super Quiet Ride'],
      bestFor: 'Premium VIP group travel, luxury outstation trips, and corporate delegates.',
      img: '/urbania.jpg'
    }
  ];

  const [fleet, setFleet] = useState(defaultFleet);

  useEffect(() => {
    API.get('/vehicles')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setFleet(res.data);
        }
      })
      .catch(err => console.error('Error fetching live fleet data:', err));
  }, []);

  const handleCompareClick = (vehicle) => {
    if (compareList.find(item => item.id === vehicle.id)) {
      setCompareList(compareList.filter(item => item.id !== vehicle.id));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare up to 3 vehicles at a time.");
        return;
      }
      setCompareList([...compareList, vehicle]);
    }
  };

  const handleBookNow = (vehicle) => {
    const totalEstimate = calculateEstimate(vehicle);
    setBookingData({
      vehicleName: vehicle.name,
      pickup: 'Your Location',
      drop: 'Destination',
      date: 'Select Date on WhatsApp',
      time: 'Select Time on WhatsApp',
      distance: distance,
      amount: totalEstimate
    });
    openPayment();
  };

  const getVehicleRate = (vehicle) => {
    if (acType === 'nonac' && vehicle.rateAc) {
      return vehicle.rate; // Return Non-AC rate
    }
    return vehicle.rateAc || vehicle.rate; // Return AC rate (or standard rate)
  };

  const calculateEstimate = (vehicle) => {
    const rate = getVehicleRate(vehicle);
    return distance * rate;
  };

  return (
    <div className="pt-24 bg-slate-50 min-h-screen">
      {/* 1. Header */}
      <section className="relative bg-navy py-16 text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80" 
            alt="Shiv Travels Fleet Banner" 
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-navy/85" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold">Our Fleet & Rates</h1>
          <p className="text-slate-300 mt-3 max-w-lg mx-auto text-sm sm:text-base">
            Choose from our range of Sedan, SUV, Traveller, and VIP Urbania vehicles. All rates are transparent and competitive.
          </p>
        </div>
      </section>

      {/* 2. Interactive Price Estimator */}
      <section className="py-12 bg-white border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 text-gold">
              <Sparkles className="w-5 h-5 fill-gold" />
              <h2 className="text-xl font-bold text-navy-dark">Instant Trip Cost Estimator</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Trip Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Trip Type</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-200/50 p-1.5 rounded-xl">
                  <button 
                    onClick={() => setTripType('round')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg transition-colors ${tripType === 'round' ? 'bg-navy text-white shadow-sm' : 'text-slate-600 hover:text-navy-dark'}`}
                  >
                    Round Trip
                  </button>
                  <button 
                    onClick={() => setTripType('oneway')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg transition-colors ${tripType === 'oneway' ? 'bg-navy text-white shadow-sm' : 'text-slate-600 hover:text-navy-dark'}`}
                  >
                    One Way Drop
                  </button>
                </div>
              </div>

              {/* AC / Non-AC Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Vehicle AC Type</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-200/50 p-1.5 rounded-xl">
                  <button 
                    onClick={() => setAcType('ac')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg transition-colors ${acType === 'ac' ? 'bg-navy text-white shadow-sm' : 'text-slate-600 hover:text-navy-dark'}`}
                  >
                    Air Conditioned (AC)
                  </button>
                  <button 
                    onClick={() => setAcType('nonac')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg transition-colors ${acType === 'nonac' ? 'bg-navy text-white shadow-sm' : 'text-slate-600 hover:text-navy-dark'}`}
                  >
                    Non-AC (Winger/TT)
                  </button>
                </div>
              </div>

              {/* Distance Slider */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Estimated Distance: <span className="text-gold font-bold text-sm">{distance} km</span>
                </label>
                <input 
                  type="range" 
                  min="50" 
                  max="1000" 
                  step="10"
                  value={distance} 
                  onChange={(e) => setDistance(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gold"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1.5">
                  <span>50 km</span>
                  <span>500 km</span>
                  <span>1000 km</span>
                </div>
              </div>
            </div>

            {/* Estimates Showcase */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 pt-4 border-t border-slate-200">
              {fleet.map((vehicle) => {
                const isAcDiff = acType === 'nonac' && !vehicle.rateAc;
                const total = calculateEstimate(vehicle);
                return (
                  <div key={vehicle.id} className={`bg-white p-4 rounded-xl border border-slate-200/80 text-center space-y-1 relative ${isAcDiff ? 'opacity-65' : ''}`}>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block truncate">{vehicle.type}</span>
                    <span className="text-[10px] text-slate-600 font-bold block truncate">{vehicle.name.split(' (')[0]}</span>
                    <span className="text-base font-black text-navy block">₹{total.toLocaleString('en-IN')}</span>
                    <span className="text-[9px] text-slate-400 block font-normal leading-tight">
                      {isAcDiff ? '(AC Rate Applied)' : `(₹${getVehicleRate(vehicle)}/km)`}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-navy bg-gold/15 p-4 rounded-xl border border-gold/30 gap-2">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-navy flex-shrink-0" />
                <span>Estimates exclude Toll, Parking, and Driver food. Minimum outstation running charges may apply.</span>
              </div>
              <span className="font-bold text-navy-dark border-l-0 sm:border-l sm:border-gold/30 pl-0 sm:pl-3">
                Tip: Toll, Parking, Driver food Extra
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Vehicles Cards Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Comparison floating trigger bar */}
          {compareList.length > 0 && (
            <div className="mb-8 p-4 bg-navy text-white rounded-2xl flex items-center justify-between border border-gold/30 shadow-lg animate-fade-in">
              <div className="flex items-center space-x-3">
                <span className="bg-gold text-navy-dark text-xs font-bold px-2 py-1 rounded-full">{compareList.length}</span>
                <span className="text-sm font-semibold">Vehicles selected for comparison</span>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setCompareList([])}
                  className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Clear Selection
                </button>
                <button 
                  onClick={() => setShowCompareModal(true)}
                  className="px-4 py-1.5 bg-gold text-navy-dark text-xs font-bold rounded-lg hover:bg-gold-light transition-colors"
                >
                  Compare Now
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {fleet.map((vehicle) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                key={vehicle.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row"
              >
                {/* Vehicle Image */}
                <div className="md:w-5/12 h-64 md:h-auto relative bg-slate-50 flex items-center justify-center min-h-[220px]">
                  <img 
                    src={vehicle.img} 
                    alt={vehicle.name} 
                    className="w-full h-full object-contain p-3"
                  />
                  <span className="absolute top-4 left-4 bg-navy-dark/95 text-gold text-xs font-bold px-3 py-1 rounded-full border border-gold/20">
                    {vehicle.type}
                  </span>
                </div>

                {/* Details */}
                <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-navy-dark">{vehicle.name}</h3>
                    
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                      <span className="bg-slate-100 px-3 py-1 rounded-full flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1" />
                        {vehicle.seats} + 1 Seats
                      </span>
                      <span className="bg-slate-100 px-3 py-1 rounded-full">
                        {vehicle.ac}
                      </span>
                      <span className="bg-slate-100 px-3 py-1 rounded-full">
                        {vehicle.luggage}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 leading-relaxed pt-2">
                      {vehicle.bestFor}
                    </p>
                  </div>

                  {/* Features Bullet List */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    {vehicle.features.map((feat, i) => (
                      <span key={i} className="text-xs text-slate-500 flex items-center">
                        <Check className="w-3.5 h-3.5 text-gold mr-1.5 flex-shrink-0" />
                        {feat}
                      </span>
                    ))}
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Rate Per KM</span>
                      <span className="text-xl font-black text-navy">
                        {vehicle.rateAc ? `₹${vehicle.rate} - ₹${vehicle.rateAc}` : `₹${vehicle.rate}`}/km
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleCompareClick(vehicle)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          compareList.find(item => item.id === vehicle.id) 
                            ? 'bg-gold/15 border-gold text-gold' 
                            : 'border-slate-300 text-slate-600 hover:border-gold hover:text-gold'
                        }`}
                      >
                        {compareList.find(item => item.id === vehicle.id) ? 'Selected' : 'Compare'}
                      </button>
                      
                      <button 
                        onClick={() => handleBookNow(vehicle)}
                        className="px-5 py-2.5 bg-gold hover:bg-gold-dark text-navy-dark font-bold text-xs rounded-xl shadow-md transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. COMPARISON MODAL */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 border border-gold/20 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowCompareModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 text-xl font-bold"
            >
              ✕
            </button>
            
            <h3 className="text-2xl font-bold text-navy-dark text-center mb-6">
              Compare Vehicles Side-by-Side
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Features</th>
                    {compareList.map((vehicle) => (
                      <th key={vehicle.id} className="py-4 px-4 text-center font-bold text-navy-dark">
                        {vehicle.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4 font-semibold text-slate-700">Seating Capacity</td>
                    {compareList.map((vehicle) => (
                      <td key={vehicle.id} className="py-4 px-4 text-center">
                        {vehicle.seats} Passengers
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4 font-semibold text-slate-700">AC / Climate Control</td>
                    {compareList.map((vehicle) => (
                      <td key={vehicle.id} className="py-4 px-4 text-center">
                        {vehicle.ac}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4 font-semibold text-slate-700">Luggage Spaces</td>
                    {compareList.map((vehicle) => (
                      <td key={vehicle.id} className="py-4 px-4 text-center">
                        {vehicle.luggage}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4 font-semibold text-slate-700">Rate per Kilometer</td>
                    {compareList.map((vehicle) => (
                      <td key={vehicle.id} className="py-4 px-4 text-center text-navy font-bold">
                        {vehicle.rateAc ? `₹${vehicle.rate} (Non-AC) / ₹${vehicle.rateAc} (AC)` : `₹${vehicle.rate}/km`}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4 font-semibold text-slate-700">Best Suited For</td>
                    {compareList.map((vehicle) => (
                      <td key={vehicle.id} className="py-4 px-4 text-center text-xs leading-relaxed text-slate-500 max-w-[200px]">
                        {vehicle.bestFor}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-6 px-4"></td>
                    {compareList.map((vehicle) => (
                      <td key={vehicle.id} className="py-6 px-4 text-center">
                        <button 
                          onClick={() => {
                             setShowCompareModal(false);
                            handleBookNow(vehicle);
                          }}
                          className="w-full py-2 bg-gold hover:bg-gold-dark text-navy-dark font-bold text-xs rounded-xl shadow-md transition-colors"
                        >
                          Book Now
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
