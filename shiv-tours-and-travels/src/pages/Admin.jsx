import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, User, LogOut, Calendar, Car, MessageSquare, Mail, 
  Check, Trash2, Edit2, ShieldAlert, Phone, ExternalLink, 
  Save, Landmark, RefreshCw, Eye, EyeOff
} from 'lucide-react';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Dynamic Data
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [packages, setPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // UI Helpers
  const [loading, setLoading] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);
  const [replyReviewId, setReplyReviewId] = useState(null);
  const [ownerReplyText, setOwnerReplyText] = useState('');

  // Check login state on load
  useEffect(() => {
    const token = localStorage.getItem('shiv_admin_token');
    if (token) {
      setIsLoggedIn(true);
      fetchDashboardData();
    }
  }, []);

  // Fetch bookings when search or status filters change
  useEffect(() => {
    if (isLoggedIn) {
      fetchBookingsOnly();
    }
  }, [searchQuery, statusFilter, isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('shiv_admin_token');
    setIsLoggedIn(false);
    setCredentials({ username: '', password: '' });
  };

  const fetchBookingsOnly = async () => {
    try {
      const token = localStorage.getItem('shiv_admin_token');
      const res = await axios.get('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchQuery, status: statusFilter }
      });
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // Fetch all dashboard collections
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('shiv_admin_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Bookings
      const bookingsRes = await axios.get('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchQuery, status: statusFilter }
      });
      setBookings(bookingsRes.data);
      
      // Vehicles
      const vehiclesRes = await axios.get('/api/vehicles');
      setVehicles(vehiclesRes.data);

      // Tour Packages
      const packagesRes = await axios.get('/api/packages');
      setPackages(packagesRes.data);
      
      // Reviews (fetching all, including unapproved ones)
      const reviewsRes = await axios.get('/api/reviews?all=true', config);
      setReviews(reviewsRes.data);
      
      // Inquiries
      const inquiriesRes = await axios.get('/api/inquiries', config);
      setInquiries(inquiriesRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await axios.post('/api/auth/login', credentials);
      if (res.data.success) {
        localStorage.setItem('shiv_admin_token', res.data.token);
        setIsLoggedIn(true);
        // Reset filters when logging in
        setSearchQuery('');
        setStatusFilter('all');
        fetchDashboardData();
      } else {
        setLoginError(res.data.message || 'Incorrect credentials');
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Error connecting to backend server');
    }
  };

  // 1. Bookings Actions
  const handleUpdateBookingStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('shiv_admin_token');
      const res = await axios.put(`/api/bookings/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setBookings(bookings.map(b => (b._id === id || b.id === id) ? res.data.booking : b));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      const token = localStorage.getItem('shiv_admin_token');
      const res = await axios.delete(`/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setBookings(bookings.filter(b => b.id !== id && b._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  // 2. Vehicle Rates & Fleet Actions
  const handleEditVehicleClick = (vehicle) => {
    setEditingVehicle({ ...vehicle });
  };

  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    if (!editingVehicle) return;
    try {
      const token = localStorage.getItem('shiv_admin_token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const parsedFeatures = typeof editingVehicle.features === 'string'
        ? editingVehicle.features.split(',').map(f => f.trim()).filter(Boolean)
        : editingVehicle.features || [];

      const vehicleData = { 
        ...editingVehicle, 
        features: parsedFeatures,
        seats: Number(editingVehicle.seats),
        rate: Number(editingVehicle.rate),
        rateAc: editingVehicle.rateAc ? Number(editingVehicle.rateAc) : undefined
      };

      const vehicleId = editingVehicle._id || editingVehicle.id;

      if (editingVehicle.isNew) {
        const sendData = { ...vehicleData };
        delete sendData.isNew;
        delete sendData.id;
        delete sendData._id;
        const res = await axios.post('/api/vehicles', sendData, { headers });
        if (res.data.success) {
          setVehicles([...vehicles, res.data.vehicle]);
          setEditingVehicle(null);
        }
      } else {
        const res = await axios.put(`/api/vehicles/${vehicleId}`, vehicleData, { headers });
        if (res.data.success) {
          setVehicles(vehicles.map(v => (v._id === vehicleId || v.id === vehicleId) ? res.data.vehicle : v));
          setEditingVehicle(null);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save vehicle details');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle forever?')) return;
    try {
      const token = localStorage.getItem('shiv_admin_token');
      const res = await axios.delete(`/api/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setVehicles(vehicles.filter(v => v._id !== id && v.id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete vehicle');
    }
  };

  // 3. Tour Packages Actions
  const handleUpdatePackage = async (e) => {
    e.preventDefault();
    if (!editingPackage) return;
    try {
      const token = localStorage.getItem('shiv_admin_token');
      const headers = { Authorization: `Bearer ${token}` };

      const parseList = (val) => {
        if (typeof val === 'string') {
          return val.split('\n').map(x => x.trim()).filter(Boolean);
        }
        return val || [];
      };

      const packageData = {
        ...editingPackage,
        itinerary: parseList(editingPackage.itinerary),
        includes: parseList(editingPackage.includes),
        excludes: parseList(editingPackage.excludes),
        rating: Number(editingPackage.rating || 5)
      };

      const packageId = editingPackage._id || editingPackage.id;

      if (editingPackage.isNew) {
        const sendData = { ...packageData };
        delete sendData.isNew;
        delete sendData.id;
        delete sendData._id;
        const res = await axios.post('/api/packages', sendData, { headers });
        if (res.data.success) {
          setPackages([...packages, res.data.package]);
          setEditingPackage(null);
        }
      } else {
        const res = await axios.put(`/api/packages/${packageId}`, packageData, { headers });
        if (res.data.success) {
          setPackages(packages.map(p => (p._id === packageId || p.id === packageId) ? res.data.package : p));
          setEditingPackage(null);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save package details');
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package forever?')) return;
    try {
      const token = localStorage.getItem('shiv_admin_token');
      const res = await axios.delete(`/api/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setPackages(packages.filter(p => p._id !== id && p.id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete package');
    }
  };

  // 4. Reviews Actions
  const handleApproveReview = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('shiv_admin_token');
      const res = await axios.put(`/api/reviews/${id}/approve`, 
        { approved: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setReviews(reviews.map(r => (r._id === id || r.id === id) ? res.data.review : r));
      }
    } catch (err) {
      alert('Failed to update review status');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review forever?')) return;
    try {
      const token = localStorage.getItem('shiv_admin_token');
      const res = await axios.delete(`/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setReviews(reviews.filter(r => r.id !== id && r._id !== id));
      }
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  const handleReplyReviewSubmit = async (e, id) => {
    e.preventDefault();
    if (!ownerReplyText.trim()) return;
    try {
      const token = localStorage.getItem('shiv_admin_token');
      const res = await axios.post(`/api/reviews/${id}/reply`, 
        { comment: ownerReplyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setReviews(reviews.map(r => (r._id === id || r.id === id) ? res.data.review : r));
        setReplyReviewId(null);
        setOwnerReplyText('');
      }
    } catch (err) {
      alert('Failed to save owner reply');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="pt-28 pb-16 min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-gold/15 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-yellow-500 to-gold" />
          
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex p-4 bg-gold/10 rounded-full border border-gold/20 text-gold mb-2">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black tracking-wide text-white">ADMIN PORTAL</h2>
            <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Shiv Tours & Travels</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Enter admin username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-700 hover:border-slate-650 focus:border-gold text-sm text-white rounded-xl outline-none transition-all placeholder:text-slate-650"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 bg-slate-900/60 border border-slate-700 hover:border-slate-650 focus:border-gold text-sm text-white rounded-xl outline-none transition-all placeholder:text-slate-650"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl shadow-lg shadow-gold/10 hover:shadow-gold/25 transition-all text-sm tracking-wide mt-2"
            >
              Sign In to Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 bg-slate-900 min-h-screen text-slate-100 font-sans">
      {/* Top Banner */}
      <section className="bg-slate-950 border-b border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="bg-gold/10 p-2.5 rounded-2xl border border-gold/20 text-gold hidden sm:block">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">SHIV TRAVELS DASHBOARD</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">Control Center & Operations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchDashboardData}
              disabled={loading}
              className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-gold' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-950/40 border border-red-500/30 hover:bg-red-950/70 text-red-400 hover:text-red-300 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="bg-slate-950 border-b border-slate-800 px-4">
        <div className="max-w-7xl mx-auto flex overflow-x-auto gap-2 py-3 scrollbar-none">
          {[
            { id: 'bookings', label: 'Bookings Log', count: bookings.length, icon: Calendar },
            { id: 'vehicles', label: 'Fleet & Pricing', count: vehicles.length, icon: Car },
            { id: 'packages', label: 'Tour Packages', count: packages.length, icon: Landmark },
            { id: 'reviews', label: 'Reviews Moderator', count: reviews.length, icon: MessageSquare },
            { id: 'inquiries', label: 'Inquiries Box', count: inquiries.length, icon: Mail }
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setEditingVehicle(null);
                  setEditingPackage(null);
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold transition-all border whitespace-nowrap ${
                  isTabActive
                    ? 'bg-gold border-gold text-slate-950 shadow-md shadow-gold/10'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                  isTabActive ? 'bg-slate-950 text-gold' : 'bg-slate-800 text-slate-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content Pane */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: BOOKINGS */}
          {activeTab === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold" />
                  Customer Bookings Log
                </h2>
                <span className="text-xs text-slate-400 font-semibold">{bookings.length} reservations found</span>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
                <div className="relative w-full md:max-w-xs">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <User className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search customer, phone, or ref..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 hover:border-slate-650 focus:border-gold text-xs text-white rounded-xl outline-none transition-all placeholder:text-slate-500"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Statuses' },
                    { id: 'Pending', label: 'Pending' },
                    { id: 'Confirmed', label: 'Confirmed' },
                    { id: 'Completed', label: 'Completed' },
                    { id: 'Cancelled', label: 'Cancelled' }
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setStatusFilter(st.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                        statusFilter === st.id
                          ? 'bg-gold border-gold text-slate-950 font-extrabold'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-750 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="bg-slate-950/60 p-16 rounded-3xl border border-slate-800 text-center space-y-3">
                  <p className="text-slate-400 text-sm">No bookings match the search criteria.</p>
                  <p className="text-xs text-slate-500">Active online and manual reservations will show up here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {bookings.map((booking) => {
                    const bookingId = booking._id || booking.id;
                    return (
                      <div 
                        key={bookingId}
                        className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700/50 shadow-lg relative overflow-hidden flex flex-col lg:flex-row justify-between gap-6"
                      >
                        {/* Left Block: Booking Main Details */}
                        <div className="space-y-4 flex-grow">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[10px] font-black tracking-wider bg-gold/15 text-gold border border-gold/25 px-2.5 py-1 rounded-full uppercase">
                              Ref: {booking.bookingRef}
                            </span>
                            <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full uppercase border ${
                              booking.bookingType === 'online'
                                ? 'bg-blue-950/40 text-blue-400 border-blue-500/20'
                                : 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20'
                            }`}>
                              {(booking.bookingType || 'whatsapp').toUpperCase()} BOOKING
                            </span>
                            <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full uppercase border ${
                              booking.status === 'Confirmed'
                                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/25'
                                : booking.status === 'Completed'
                                ? 'bg-blue-950/40 text-blue-400 border-blue-500/25'
                                : booking.status === 'Cancelled'
                                ? 'bg-red-950/40 text-red-400 border-red-500/25'
                                : 'bg-yellow-950/40 text-yellow-500 border-yellow-500/25'
                            }`}>
                              {booking.status || 'Pending'}
                            </span>
                            <span className="text-xs text-slate-400">
                              Booked on {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'} at {booking.createdAt ? new Date(booking.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            {/* Route & Date */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trip Details</span>
                              <div className="text-sm font-extrabold text-white">
                                {booking.pickup} &rarr; {booking.drop}
                              </div>
                              <div className="text-xs text-slate-300">
                                Date: <span className="font-bold text-gold">{booking.date}</span> at <span className="font-bold text-gold">{booking.time}</span>
                              </div>
                            </div>

                            {/* Customer info */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer Contact</span>
                              <div className="text-sm font-extrabold text-white">{booking.customerName}</div>
                              <div className="text-xs text-slate-300 flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                <a href={`tel:${booking.phone}`} className="hover:text-gold transition-colors">{booking.phone}</a>
                              </div>
                            </div>

                            {/* Vehicle info */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cab Choice</span>
                              <div className="text-sm font-extrabold text-white">{booking.vehicleName || booking.vehicleType}</div>
                              <div className="text-xs text-slate-400">
                                Estimated Dist: <span className="font-bold text-slate-300">{booking.distance || 'N/A'} km</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Block: Financials & Actions */}
                        <div className="flex flex-col sm:flex-row lg:flex-col justify-between items-start sm:items-center lg:items-end gap-6 min-w-[200px] border-t lg:border-t-0 lg:border-l border-slate-700/50 pt-6 lg:pt-0 lg:pl-6">
                          <div className="space-y-1 text-left lg:text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment Details</span>
                            <div className="text-lg font-black text-white">₹{booking.amount} Total</div>
                            <div className="text-xs text-slate-300 flex flex-col lg:items-end">
                              <span>Paid Token: <span className="font-bold text-emerald-400">₹{booking.paidAmount}</span></span>
                              <span>Balance Due: <span className="font-bold text-yellow-450">₹{booking.balanceAmount}</span></span>
                            </div>
                            {booking.txnId && booking.txnId !== 'N/A' && (
                              <span className="text-[9px] text-slate-500 block mt-1">Txn ID: {booking.txnId}</span>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 w-full">
                            {/* Status controls */}
                            <div className="flex gap-1.5 w-full">
                              {booking.status === 'Pending' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(bookingId, 'Confirmed')}
                                  className="flex-1 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/30 transition-all text-center"
                                >
                                  Confirm
                                </button>
                              )}
                              {booking.status === 'Confirmed' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(bookingId, 'Completed')}
                                  className="flex-1 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-bold rounded-xl border border-blue-500/30 transition-all text-center"
                                >
                                  Complete
                                </button>
                              )}
                              {booking.status !== 'Completed' && booking.status !== 'Cancelled' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(bookingId, 'Cancelled')}
                                  className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 transition-all text-center"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>

                            <div className="flex gap-2 w-full">
                              <a
                                href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                WhatsApp
                              </a>
                              <button
                                onClick={() => handleDeleteBooking(bookingId)}
                                className="px-3 py-2 bg-red-950/40 border border-red-500/30 hover:bg-red-950/80 text-red-400 hover:text-red-300 rounded-xl transition-all"
                                title="Delete Booking Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: VEHICLES */}
          {activeTab === 'vehicles' && (
            <motion.div
              key="vehicles"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Car className="w-5 h-5 text-gold" />
                  Vehicle Fleet Rates & Capacity Management
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditingVehicle({
                      isNew: true,
                      name: '',
                      type: 'Sedan',
                      seats: 4,
                      ac: 'AC',
                      rate: 11,
                      rateAc: 13,
                      luggage: '2 bags',
                      features: 'Music, GPS, Charger',
                      bestFor: 'Nashik Pilgrimage',
                      img: ''
                    })}
                    className="px-4 py-2 bg-gold hover:bg-gold-dark text-slate-950 text-xs font-bold rounded-xl transition-all"
                  >
                    + Add New Vehicle
                  </button>
                  <span className="text-xs text-slate-400 font-semibold">{vehicles.length} models configured</span>
                </div>
              </div>

              {editingVehicle && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-slate-800 p-6 rounded-3xl border border-gold/25 space-y-4"
                >
                  <h3 className="text-sm font-bold text-gold uppercase tracking-wider">
                    {editingVehicle.isNew ? 'Add New Vehicle' : `Edit Vehicle: ${editingVehicle.name}`}
                  </h3>
                  <form onSubmit={handleUpdateVehicle} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Vehicle Name</label>
                      <input 
                        type="text" 
                        value={editingVehicle.name} 
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white"
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Vehicle Type (e.g. Hatchback, Sedan, SUV)</label>
                      <input 
                        type="text" 
                        value={editingVehicle.type} 
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, type: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white"
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Capacity Seats</label>
                      <input 
                        type="number" 
                        value={editingVehicle.seats} 
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, seats: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white"
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">AC Configuration (e.g. AC, Non-AC)</label>
                      <input 
                        type="text" 
                        value={editingVehicle.ac} 
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, ac: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white"
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Standard Rate (per km)</label>
                      <input 
                        type="number" 
                        value={editingVehicle.rate} 
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, rate: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white"
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">AC Rate (per km, if applicable)</label>
                      <input 
                        type="number" 
                        value={editingVehicle.rateAc || ''} 
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, rateAc: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white"
                        placeholder="N/A"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Luggage Space (e.g. 2 bags)</label>
                      <input 
                        type="text" 
                        value={editingVehicle.luggage || ''} 
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, luggage: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Best For</label>
                      <input 
                        type="text" 
                        value={editingVehicle.bestFor || ''} 
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, bestFor: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Image URL</label>
                      <input 
                        type="text" 
                        value={editingVehicle.img || ''} 
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, img: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white"
                      />
                    </div>
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Features (comma separated)</label>
                      <input 
                        type="text" 
                        value={editingVehicle.features ? (Array.isArray(editingVehicle.features) ? editingVehicle.features.join(', ') : editingVehicle.features) : ''} 
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, features: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white"
                        placeholder="Music System, GPS, AC, Luggage Carrier"
                      />
                    </div>
                    <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setEditingVehicle(null)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-650 text-xs font-bold rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-5 py-2 bg-gold hover:bg-gold-dark text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save Vehicle
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => {
                  const vehicleId = vehicle._id || vehicle.id;
                  return (
                    <div 
                      key={vehicleId} 
                      className="bg-slate-800/80 rounded-3xl p-5 border border-slate-700/50 flex flex-col justify-between gap-4"
                    >
                      <div className="flex gap-4">
                        {vehicle.img && (
                          <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-700/60">
                            <img src={vehicle.img} alt={vehicle.name} className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div className="space-y-1">
                          <h4 className="text-sm font-extrabold text-white">{vehicle.name}</h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{vehicle.type} ({vehicle.ac})</span>
                          <span className="text-xs text-slate-350 block">Capacity: {vehicle.seats} seats</span>
                        </div>
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-700/40 grid grid-cols-2 text-center text-xs">
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 uppercase block">Standard Rate</span>
                          <span className="font-extrabold text-white text-sm">₹{vehicle.rate}/km</span>
                        </div>
                        <div className="border-l border-slate-700/50">
                          <span className="text-[9px] font-bold text-slate-500 uppercase block">AC Rate</span>
                          <span className="font-extrabold text-gold text-sm">{vehicle.rateAc ? `₹${vehicle.rateAc}/km` : 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditVehicleClick(vehicle)}
                          className="flex-grow py-2 bg-slate-900 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-650 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-gold" />
                          Modify Config
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicleId)}
                          className="p-2 bg-red-950/40 border border-red-500/30 hover:bg-red-950/80 text-red-400 hover:text-red-300 rounded-xl transition-all"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 3: PACKAGES */}
          {activeTab === 'packages' && (
            <motion.div
              key="packages"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-gold" />
                  Tour Packages Management
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditingPackage({
                      isNew: true,
                      title: '',
                      type: 'Pilgrimage',
                      duration: '1 Day',
                      price: '₹3,000 onwards',
                      img: '',
                      rating: 5,
                      description: '',
                      itinerary: '',
                      includes: '',
                      excludes: ''
                    })}
                    className="px-4 py-2 bg-gold hover:bg-gold-dark text-slate-950 text-xs font-bold rounded-xl transition-all"
                  >
                    + Add New Package
                  </button>
                  <span className="text-xs text-slate-400 font-semibold">{packages.length} packages active</span>
                </div>
              </div>

              {editingPackage && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-slate-800 p-6 rounded-3xl border border-gold/25 space-y-4"
                >
                  <h3 className="text-sm font-bold text-gold uppercase tracking-wider">
                    {editingPackage.isNew ? 'Create New Package' : `Edit Package: ${editingPackage.title}`}
                  </h3>
                  <form onSubmit={handleUpdatePackage} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Package Title</label>
                      <input 
                        type="text" 
                        value={editingPackage.title} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white"
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Type (e.g. Pilgrimage, Leisure)</label>
                      <input 
                        type="text" 
                        value={editingPackage.type} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, type: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white"
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Duration (e.g. 2 Days / 1 Night)</label>
                      <input 
                        type="text" 
                        value={editingPackage.duration} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white"
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Price (e.g. ₹3,500 onwards)</label>
                      <input 
                        type="text" 
                        value={editingPackage.price} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white"
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Image URL</label>
                      <input 
                        type="text" 
                        value={editingPackage.img || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, img: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Rating (1 to 5)</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="5"
                        value={editingPackage.rating || 5} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, rating: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Description</label>
                      <textarea 
                        value={editingPackage.description || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white min-h-[60px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Itinerary (one point per line)</label>
                      <textarea 
                        value={Array.isArray(editingPackage.itinerary) ? editingPackage.itinerary.join('\n') : editingPackage.itinerary || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, itinerary: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white min-h-[100px]"
                        placeholder="Nashik departure&#10;Trimbakeshwar Temple visit&#10;Return to hotel"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Includes (one point per line)</label>
                      <textarea 
                        value={Array.isArray(editingPackage.includes) ? editingPackage.includes.join('\n') : editingPackage.includes || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, includes: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white min-h-[100px]"
                        placeholder="Fuel & Toll taxes&#10;Driver charges&#10;AC Cab for sightseeing"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Excludes (one point per line)</label>
                      <textarea 
                        value={Array.isArray(editingPackage.excludes) ? editingPackage.excludes.join('\n') : editingPackage.excludes || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, excludes: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-gold px-3 py-2 rounded-xl text-sm outline-none text-white min-h-[80px]"
                        placeholder="Food and accommodation&#10;Entry tickets for sightseeing"
                      />
                    </div>
                    <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setEditingPackage(null)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-650 text-xs font-bold rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-5 py-2 bg-gold hover:bg-gold-dark text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save Package
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => {
                  const packageId = pkg._id || pkg.id;
                  return (
                    <div 
                      key={packageId} 
                      className="bg-slate-800/80 rounded-3xl p-5 border border-slate-700/50 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        {pkg.img && (
                          <div className="w-full h-40 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/60">
                            <img src={pkg.img} alt={pkg.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="space-y-1">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-sm font-extrabold text-white">{pkg.title}</h4>
                            <span className="text-[10px] font-bold text-gold uppercase tracking-widest bg-gold/10 px-2 py-0.5 rounded-full border border-gold/20 flex-shrink-0">
                              {pkg.type}
                            </span>
                          </div>
                          <span className="text-xs text-slate-350 block">Duration: {pkg.duration}</span>
                          <span className="text-xs text-slate-400 block line-clamp-2 italic">"{pkg.description}"</span>
                        </div>
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-700/40 flex justify-between items-center text-xs">
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 uppercase block">Starting Price</span>
                          <span className="font-extrabold text-white text-sm">{pkg.price}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 uppercase block text-right">Rating</span>
                          <span className="font-extrabold text-gold text-sm block text-right">★ {pkg.rating}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingPackage({ ...pkg })}
                          className="flex-1 py-2 bg-slate-900 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-650 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-gold" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePackage(packageId)}
                          className="p-2 bg-red-950/40 border border-red-500/30 hover:bg-red-950/80 text-red-400 hover:text-red-300 rounded-xl transition-all"
                          title="Delete Tour Package"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gold" />
                  Customer Reviews Moderation Panel
                </h2>
                <span className="text-xs text-slate-400 font-semibold">{reviews.length} reviews log</span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {reviews.map((rev) => {
                  const reviewId = rev._id || rev.id;
                  return (
                    <div 
                      key={reviewId}
                      className={`bg-slate-800/80 rounded-3xl p-6 border transition-all ${
                        rev.approved ? 'border-slate-700/50' : 'border-gold/30 shadow-md shadow-gold/5 bg-slate-850'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm font-extrabold text-white">{rev.name}</span>
                            <div className="flex text-gold">
                              {[...Array(rev.rating)].map((_, i) => (
                                <span key={i} className="text-sm">★</span>
                              ))}
                            </div>
                            {!rev.approved && (
                              <span className="text-[9px] font-black bg-gold/15 text-gold border border-gold/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Pending Approval
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{rev.date || 'New Review'}</span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveReview(reviewId, rev.approved)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                              rev.approved 
                                ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white' 
                                : 'bg-gold border-gold text-slate-950 font-extrabold'
                            }`}
                          >
                            {rev.approved ? 'Disapprove' : 'Approve Review'}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteReview(reviewId)}
                            className="p-2 bg-red-950/40 border border-red-500/30 hover:bg-red-950/80 text-red-400 hover:text-red-300 rounded-xl transition-all"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-slate-300 text-xs mt-3 leading-relaxed italic bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
                        "{rev.comment}"
                      </p>

                      {/* Owner reply */}
                      {rev.ownerReply && rev.ownerReply.comment ? (
                        <div className="mt-4 ml-6 p-3 bg-slate-900 rounded-2xl border-l-2 border-gold text-xs">
                          <span className="font-bold text-gold block mb-1">Response from Owner:</span>
                          <p className="text-slate-300 italic">"{rev.ownerReply.comment}"</p>
                        </div>
                      ) : (
                        <div className="mt-4">
                          {replyReviewId === reviewId ? (
                            <form 
                              onSubmit={(e) => handleReplyReviewSubmit(e, reviewId)} 
                              className="mt-3 flex gap-2"
                            >
                              <input 
                                type="text"
                                value={ownerReplyText}
                                onChange={(e) => setOwnerReplyText(e.target.value)}
                                placeholder="Write your polite owner response..."
                                className="flex-grow bg-slate-900 border border-slate-700 focus:border-gold px-3.5 py-2 rounded-xl text-xs outline-none text-white"
                                required
                              />
                              <button 
                                type="submit"
                                className="px-4 py-2 bg-gold hover:bg-gold-dark text-slate-950 text-xs font-bold rounded-xl transition-all"
                              >
                                Post
                              </button>
                              <button 
                                type="button"
                                onClick={() => setReplyReviewId(null)}
                                className="px-3 py-2 bg-slate-700 hover:bg-slate-650 text-slate-300 text-xs font-bold rounded-xl transition-all"
                              >
                                Cancel
                              </button>
                            </form>
                          ) : (
                            <button
                              onClick={() => {
                                setReplyReviewId(reviewId);
                                setOwnerReplyText('');
                              }}
                              className="text-[10px] font-bold text-gold hover:text-gold-light mt-2 inline-flex items-center gap-1"
                            >
                              &crarr; Reply as Owner
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 5: INQUIRIES */}
          {activeTab === 'inquiries' && (
            <motion.div
              key="inquiries"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gold" />
                  Contact Form Inquiries Box
                </h2>
                <span className="text-xs text-slate-400 font-semibold">{inquiries.length} inquiries received</span>
              </div>

              {inquiries.length === 0 ? (
                <div className="bg-slate-950/60 p-16 rounded-3xl border border-slate-800 text-center space-y-3">
                  <p className="text-slate-400 text-sm">Your contact inbox is empty.</p>
                  <p className="text-xs text-slate-500">Messages sent via the Contact page form will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {inquiries.map((inq) => {
                    const inqId = inq._id || inq.id;
                    return (
                      <div 
                        key={inqId}
                        className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700/50 shadow-lg relative flex flex-col md:flex-row justify-between gap-4"
                      >
                        <div className="space-y-3 flex-grow">
                          <div className="flex items-center gap-3">
                            <h4 className="text-sm font-extrabold text-white">{inq.name}</h4>
                            <span className="text-xs text-slate-400 font-semibold">
                              Received {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'N/A'} at {inq.createdAt ? new Date(inq.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-slate-300">
                            {inq.phone && (
                              <div>
                                Phone: <a href={`tel:${inq.phone}`} className="font-semibold text-gold hover:underline">{inq.phone}</a>
                              </div>
                            )}
                            {inq.email && (
                              <div>
                                Email: <a href={`mailto:${inq.email}`} className="font-semibold text-slate-300 hover:text-gold transition-colors">{inq.email}</a>
                              </div>
                            )}
                          </div>

                          <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3.5 rounded-2xl border border-slate-800/80 mt-2 font-mono">
                            {inq.message}
                          </div>
                        </div>

                        <div className="flex md:flex-col justify-end gap-2.5 min-w-[120px] border-t md:border-t-0 md:border-l border-slate-700/50 pt-4 md:pt-0 md:pl-4">
                          <a
                            href={`tel:${inq.phone}`}
                            className="flex-1 md:flex-initial px-4 py-2 bg-slate-900 border border-slate-700 hover:border-slate-650 hover:bg-slate-750 text-slate-200 text-xs font-bold rounded-xl text-center transition-all flex items-center justify-center gap-1.5"
                          >
                            <Phone className="w-3 h-3" />
                            Call Customer
                          </a>
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inq.name)},%20this%20is%20Shiv%20Tours%20and%20Travels%20regarding%20your%20inquiry.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 md:flex-initial px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold rounded-xl text-center transition-all flex items-center justify-center gap-1.5"
                          >
                            <ExternalLink className="w-3 h-3" />
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default Admin;
