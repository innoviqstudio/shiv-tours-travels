import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Sparkles, Check, X, PhoneCall } from 'lucide-react';
import { API } from '../api';

const Packages = ({ setBookingData, openPayment }) => {
  const [filter, setFilter] = useState('all');
  const [selectedPack, setSelectedPack] = useState(null);

  const defaultPackages = [
    {
      _id: 'pkg_1',
      title: 'Shirdi Sai Baba Spiritual Tour',
      type: 'spiritual',
      duration: '1 Day Trip',
      price: 'Starting from ₹2,999',
      description: 'Spiritual journey from Nashik/Mumbai to Shirdi Sai Baba Temple & Shani Shingnapur.',
      img: '/shirdi.png',
      itinerary: [
        '06:00 AM - Driver picks you up from your location in Nashik.',
        '08:00 AM - Reach Shirdi Sai Temple, join darshan queue.',
        '12:30 PM - Traditional vegetarian lunch at Shirdi.',
        '02:00 PM - Drive to Shani Shingnapur Temple.',
        '04:30 PM - Start return journey back to Nashik.',
        '07:30 PM - Drop back safely at your residence.'
      ],
      includes: ['AC Sedan vehicle', 'Experienced Driver', 'Fuel & State Taxes', 'Home Pickup & Drop'],
      excludes: ['Darshan VIP Pass costs', 'Food & Hotel meals', 'Parking charges at temple']
    },
    {
      _id: 'pkg_2',
      title: 'Nashik Vineyards & Temples',
      type: 'weekend',
      duration: 'Weekend Special (2 Days)',
      price: 'Starting from ₹5,499',
      description: 'Perfect mix of historical temples and modern Sula Vineyards sightseeing.',
      img: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
      itinerary: [
        'Day 1 - Morning visit to Trimbakeshwar Shiva Jyotirlinga Temple, Panchavati, and Kalaram Temple.',
        'Day 1 - Evening walk along the Godavari River Ram Kund.',
        'Day 2 - Morning check-out for Sula Vineyards wine tasting & vineyard tour.',
        'Day 2 - Afternoon visit to Someshwar Waterfalls and Pandavleni Buddhist Caves.',
        'Day 2 - Evening drop off at Nashik Railway Station or Hotel.'
      ],
      includes: ['AC Hatchback/Sedan', 'Local Guide assistance', 'Fuel & toll taxes', 'Hotel transfers'],
      excludes: ['Sula Entry & Wine tasting ticket fees', 'Hotel accommodation stay', 'Personal shopping expenses']
    },
    {
      _id: 'pkg_3',
      title: 'Mahabaleshwar & Panchgani Escape',
      type: 'family',
      duration: '3 Days / 2 Nights',
      price: 'Starting from ₹12,999',
      description: 'Scenic hill station journey with viewpoints, strawberry farms, and lake boating.',
      img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
      itinerary: [
        'Day 1 - Morning drive from Nashik/Mumbai to Mahabaleshwar. Check-in to hotel.',
        'Day 1 - Sunset view at Bombay Point and local market shopping.',
        'Day 2 - Visit Venna Lake for boating, Mapro Garden, and Panchgani table-land.',
        'Day 3 - Morning visit to Pratapgad Fort & historical heritage walk.',
        'Day 3 - Afternoon return drive back to Nashik/Mumbai.'
      ],
      includes: ['AC SUV (Ertiga/Innova)', 'Intercity state border permits', 'Driver hotel stay/food allowance', 'Luggage space'],
      excludes: ['Hotel booking accommodation', 'Venna Lake boating tickets', 'Pratapgad local guide charges']
    },
    {
      _id: 'pkg_4',
      title: 'Ashtavinayak Ganesha Pilgrimage',
      type: 'spiritual',
      duration: '3 Days Trip',
      price: 'Starting from ₹15,999',
      description: 'Holy tour to visit all 8 self-manifested (Swayambhu) Ganesha temples in Maharashtra.',
      img: 'https://images.unsplash.com/photo-1626014303757-6fcbe6a53596?auto=format&fit=crop&w=600&q=80',
      itinerary: [
        'Day 1 - Moreshwar (Morgaon), Siddhivinayak (Siddhatek), and Chintamani (Theur).',
        'Day 2 - Girijatmak (Lenyadri Hill Cave), Vighneshwar (Ozar), and Mahaganapati (Ranjangaon).',
        'Day 3 - Varadvinayak (Mahad) and Ballaleshwar (Pali). Return to starting location.'
      ],
      includes: ['AC SUV Crysta/Ertiga', 'Experienced route driver', 'State boundary toll permissions', 'Daily vehicle cleaning'],
      excludes: ['Pooja materials & temple offerings', 'Hotel stay rooms', 'All lunch & dinner meals']
    },
    {
      _id: 'pkg_5',
      title: 'Lonavala & Khandala Weekend',
      type: 'weekend',
      duration: '2 Days / 1 Night',
      price: 'Starting from ₹7,499',
      description: 'Explore the western ghats waterfalls, wax museums, and enjoy fresh chikki.',
      img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      itinerary: [
        'Day 1 - Morning pickup. Drive through scenic Khandala Ghats. Visit Tiger Point.',
        'Day 1 - Check-in at Lonavala Hotel. Afternoon visit to Sunil Wax Museum.',
        'Day 2 - Visit Bhushi Dam, Karla Caves, and Bhaja Caves.',
        'Day 2 - Buy Lonavala Chikki. Start return trip. Late evening drop.'
      ],
      includes: ['AC Car (Sedan)', 'Toll taxes on Expressway', 'Fuel costs', 'Driver allowances'],
      excludes: ['Cave entrance fees', 'Food & snacks', 'Hotel stay rooms']
    }
  ];

  const [packages, setPackages] = useState(defaultPackages);

  useEffect(() => {
    API.get('/packages')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setPackages(res.data);
        }
      })
      .catch(err => console.error('Error fetching live tour packages:', err));
  }, []);

  const filteredPackages = filter === 'all' 
    ? packages 
    : packages.filter(p => p.type === filter);

  const handleBookPackage = (pack) => {
    const amountVal = parseInt(pack.price.replace(/[^0-9]/g, '')) || 2999;
    setBookingData({
      vehicleName: pack.title,
      pickup: 'Nashik / Local location',
      drop: pack.title,
      date: 'Select Date on WhatsApp',
      time: 'Select Time on WhatsApp',
      amount: amountVal
    });
    openPayment();
  };

  return (
    <div className="pt-24 bg-slate-50 min-h-screen">
      {/* 1. Banner */}
      <section className="relative bg-navy py-16 text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1626014303757-6fcbe6a53596?auto=format&fit=crop&w=1200&q=80" 
            alt="Tour Packages Banner" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-navy/85" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold">Tour Packages</h1>
          <p className="text-slate-300 mt-3 max-w-lg mx-auto text-sm sm:text-base">
            Explore our curated itineraries around Maharashtra. From spiritual visits to scenic hill station escapes, we have plans for every family.
          </p>
        </div>
      </section>

      {/* 2. Filter Bar */}
      <section className="py-8 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: 'All Packages' },
            { id: 'spiritual', label: 'Spiritual / Darshan Tours' },
            { id: 'weekend', label: 'Weekend Getaways' },
            { id: 'family', label: 'Family Holidays' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`py-2 px-5 text-xs sm:text-sm font-bold rounded-full transition-all border ${
                filter === tab.id 
                  ? 'bg-gold border-gold text-navy-dark shadow-md shadow-gold/15' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-gold hover:text-gold'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Packages Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pack) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                key={pack.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
              >
                {/* Image & Tag */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img 
                    src={pack.img} 
                    alt={pack.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/75 to-transparent" />
                  
                  {/* Category Tag */}
                  <span className="absolute top-4 left-4 bg-navy-dark/95 text-gold text-xs font-bold px-3 py-1 rounded-full border border-gold/20 capitalize">
                    {pack.type} Tour
                  </span>

                  {/* Duration Tag */}
                  <span className="absolute bottom-4 left-4 bg-gold text-navy-dark text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                    {pack.duration}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 space-y-4 flex flex-col flex-grow justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-navy-dark group-hover:text-gold transition-colors">
                      {pack.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {pack.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Cost</span>
                      <span className="text-base font-extrabold text-navy">{pack.price}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedPack(pack)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleBookPackage(pack)}
                        className="px-4 py-2 bg-gold hover:bg-gold-dark text-navy-dark font-bold text-xs rounded-xl shadow-md transition-colors"
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

      {/* 4. DETAILS POPUP MODAL */}
      {selectedPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-gold/20 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedPack(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 text-xl font-bold"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="h-44 w-full rounded-2xl overflow-hidden mb-6 relative">
              <img src={selectedPack.img} alt={selectedPack.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-navy/20" />
              <span className="absolute bottom-4 left-4 bg-gold text-navy-dark text-xs font-bold px-3 py-1 rounded-full">
                {selectedPack.duration}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-navy-dark mb-2">{selectedPack.title}</h3>
            <p className="text-xs font-semibold text-slate-500 mb-6 flex items-center">
              <MapPin className="w-4 h-4 text-gold mr-1.5" />
              Maharashtra Tourism Circuit &bull; {selectedPack.price}
            </p>

            {/* Itinerary */}
            <div className="space-y-4 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block border-b pb-1">Planned Itinerary</span>
              <ul className="space-y-2 text-sm text-slate-600">
                {selectedPack.itinerary.map((step, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="w-2.5 h-2.5 rounded-full bg-gold flex-shrink-0 mt-1.5 mr-2.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Includes & Excludes grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-green-600 block">What is Included</span>
                <ul className="space-y-1 text-xs text-slate-500">
                  {selectedPack.includes.map((inc, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="w-3.5 h-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-500 block">Not Included</span>
                <ul className="space-y-1 text-xs text-slate-500">
                  {selectedPack.excludes.map((exc, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-2 flex-shrink-0" />
                      {exc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
              <button 
                onClick={() => {
                  setSelectedPack(null);
                  handleBookPackage(selectedPack);
                }}
                className="w-full sm:w-1/2 py-3 bg-gold hover:bg-gold-dark text-navy-dark font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 mr-2" />
                Book Package
              </button>
              <button 
                onClick={() => setSelectedPack(null)}
                className="w-full sm:w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors text-center cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packages;
