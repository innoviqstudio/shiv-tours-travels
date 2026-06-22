import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API } from '../api';
import { Star, MessageSquare, ThumbsUp, Send, CheckCircle2 } from 'lucide-react';

const Reviews = () => {
  const defaultReviews = [
    {
      name: 'Nilesh Gade',
      rating: 5,
      date: '5 months ago',
      comment: 'I have used Shiv Tours and Travels on multiple occasions. On each journey the service was of top level. All the driving staff were extremely polite and very professional. The owner did keep in touch after journey to see everything went OK.',
      approved: true,
      ownerReply: {
        name: 'Shiv Tours And Travels (owner)',
        date: '4 months ago',
        comment: 'Thank u for feedback sir...'
      }
    },
    {
      name: 'Suraj Chaudhari',
      rating: 5,
      date: '4 months ago',
      comment: 'Excellent service. Clean car and the driver was very courteous. Our driver was rushikesh chaudhari',
      approved: true
    },
    {
      name: 'Kapil Gaikwad',
      rating: 5,
      date: '4 months ago',
      comment: 'Driver n driving was so good. Happy with shiv tours and travels',
      approved: true
    },
    {
      name: 'Mayura G',
      rating: 5,
      date: '4 months ago',
      comment: 'Clean vehicle and polite driver. Made our Nashik outstation family trip extremely memorable and stress-free.',
      approved: true
    }
  ];

  const [reviews, setReviews] = useState(defaultReviews);

  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchReviews = () => {
    API.get('/reviews')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setReviews(res.data);
        }
      })
      .catch(err => console.error('Error fetching reviews:', err));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      alert("Please enter both your name and review comment.");
      return;
    }
    
    try {
      const res = await API.post('/reviews', newReview);
      if (res.data.success) {
        setNewReview({ name: '', rating: 5, comment: '' });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
        fetchReviews();
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } catch (err) {
      alert('Failed to submit review. Server error.');
    }
  };

  return (
    <div className="pt-24 bg-slate-50 min-h-screen">
      {/* 1. Banner */}
      <section className="relative bg-navy py-16 text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80" 
            alt="Customer Reviews Banner" 
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-navy/85" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold">Customer Reviews</h1>
          <p className="text-slate-300 mt-3 max-w-lg mx-auto text-sm sm:text-base">
            Read real-world testimonials from our passengers. We take pride in maintaining a 5-star service rating across Maharashtra.
          </p>
        </div>
      </section>

      {/* 2. Rating Stats Summary */}
      <section className="py-12 bg-white border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center justify-around gap-8">
            {/* Big Score */}
            <div className="text-center space-y-2 flex flex-col items-center">
              <span className="text-5xl font-black text-navy block leading-none">5.0</span>
              <div className="flex justify-center text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-slate-500 font-medium block">Based on Google Business Reviews</span>
              <a 
                href="https://www.google.com/maps/place/Shiv+Tours+And+Travels/@20.0166362,73.7617188,17z/data=!4m14!1m7!3m6!1s0x3bddeba232f6a8bb:0xbbc6314cfb9b277b!2sShiv+Tours+And+Travels!8m2!3d20.0166362!4d73.7617188!16s%2Fg%2F11xcngthdz!3m5!1s0x3bddeba232f6a8bb:0xbbc6314cfb9b277b!8m2!3d20.0166362!4d73.7617188!16s%2Fg%2F11xcngthdz?hl=en-IN&entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 px-5 py-2.5 bg-gold hover:bg-gold-dark text-navy-dark text-xs font-bold rounded-xl shadow-md transition-colors inline-flex items-center"
              >
                Write a Review on Google Maps
              </a>
            </div>

            {/* Progress Bars */}
            <div className="flex-grow max-w-sm space-y-2.5">
              {[
                { stars: 5, pct: '100%' },
                { stars: 4, pct: '0%' },
                { stars: 3, pct: '0%' },
                { stars: 2, pct: '0%' },
                { stars: 1, pct: '0%' }
              ].map((row, idx) => (
                <div key={idx} className="flex items-center text-xs text-slate-500">
                  <span className="w-12 font-semibold text-slate-600">{row.stars} Stars</span>
                  <div className="flex-grow bg-slate-200 h-2 rounded-full overflow-hidden mx-3">
                    <div className="bg-gold h-full rounded-full" style={{ width: row.pct }} />
                  </div>
                  <span className="w-8 text-right font-bold text-slate-700">{row.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Review Board */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left side Reviews list */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl font-bold text-navy-dark border-b pb-4">
                What Our Passengers Say
              </h2>
              
              <div className="space-y-6">
                {reviews.map((rev, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    key={index}
                    className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/60 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-gold">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400 font-semibold">{rev.date}</span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-600 italic leading-relaxed">
                      "{rev.comment}"
                    </p>

                    {/* Owner Response nested box */}
                    {rev.ownerReply && (
                      <div className="mt-4 ml-4 sm:ml-6 p-4 bg-slate-50 border-l-4 border-gold rounded-r-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-navy-dark">{rev.ownerReply.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{rev.ownerReply.date}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                          "{rev.ownerReply.comment}"
                        </p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-navy/10 text-navy font-bold flex items-center justify-center">
                          {rev.name.charAt(0)}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-navy-dark block">{rev.name}</span>
                          <span className="text-xs text-slate-400 block">Verified Passenger</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-400 text-xs hover:text-navy cursor-pointer">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Helpful</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right side form */}
            <div className="lg:col-span-5">
              <div className="bg-navy-dark text-white p-6 sm:p-8 rounded-3xl border border-gold/25 shadow-xl sticky top-28 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <MessageSquare className="w-5 h-5 text-gold mr-2" />
                    Write a Review
                  </h3>
                  <p className="text-xs text-slate-400">
                    Share your experience with Shiv Travels to help other passengers.
                  </p>
                </div>

                {showSuccess && (
                  <div className="p-4 bg-green-500/25 border border-green-500/50 rounded-xl flex items-start space-x-2.5 text-slate-100 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Your review was submitted successfully and is pending administrator approval! Thank you.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-navy-dark">
                  
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Your Rating
                    </label>
                    <div className="flex items-center space-x-1.5 bg-navy-light/40 border border-slate-700/50 p-2.5 rounded-xl">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setNewReview({ ...newReview, rating: val })}
                          className="p-1 focus:outline-none"
                        >
                          <Star 
                            className={`w-6 h-6 ${
                              val <= newReview.rating 
                                ? 'fill-gold text-gold' 
                                : 'text-slate-500 hover:text-gold/50'
                            } transition-colors`}
                          />
                        </button>
                      ))}
                      <span className="text-xs text-slate-300 font-bold ml-2">
                        {newReview.rating} Stars
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Your Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g., Mahesh Shinde"
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full bg-navy-light/50 border border-slate-700 hover:border-gold/50 focus:border-gold rounded-xl py-3 px-4 text-white placeholder-slate-500 text-sm focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Your Message
                    </label>
                    <textarea 
                      rows="4"
                      placeholder="Write your review here. How was the car? How was the driver?"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full bg-navy-light/50 border border-slate-700 hover:border-gold/50 focus:border-gold rounded-xl py-3 px-4 text-white placeholder-slate-500 text-sm focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-4 bg-gold hover:bg-gold-dark text-navy-dark font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg shadow-gold/20"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                  </button>

                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Reviews;
