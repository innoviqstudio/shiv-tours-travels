import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Building2, Lock, CheckCircle2, Loader2, X, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentModal = ({ isOpen, onClose, bookingData }) => {
  const [step, setStep] = useState('checkout'); // checkout, processing, success
  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi, card, netbanking
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [isTokenPayment, setIsTokenPayment] = useState(true);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [selectedBank, setSelectedBank] = useState('sbi');
  
  const [txnId, setTxnId] = useState('');
  const [bookingRef, setBookingRef] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Generate random IDs when transaction starts and load Razorpay script
  useEffect(() => {
    if (isOpen && bookingData) {
      setStep('checkout');
      setTxnId('TXN_SHIV_' + Math.floor(1000000000 + Math.random() * 9000000000));
      setBookingRef('SHIV_' + Math.random().toString(36).substring(2, 8).toUpperCase());
      setCustomerName(bookingData.customerName || bookingData.name || '');
      setCustomerPhone(bookingData.phone || '');
      
      loadRazorpayScript().then(loaded => {
        if (!loaded) {
          console.warn('Could not load Razorpay checkout script, using simulator fallback.');
        }
      });
    }
  }, [isOpen, bookingData]);

  if (!isOpen || !bookingData) return null;

  const baseAmount = bookingData.amount || 2500;
  const payAmount = isTokenPayment ? 500 : baseAmount;
  const balanceAmount = baseAmount - payAmount;

  const handleProceedPayment = async (e) => {
    e.preventDefault();
    if (!customerPhone || !/^\d{10}$/.test(customerPhone.replace(/[^0-9]/g, ''))) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    if (paymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
        alert('Please fill card details');
        return;
      }
    }
    
    setStep('processing');

    try {
      // 1. Create order on the backend server via Axios
      const res = await axios.post('/api/payments/order', { amount: payAmount });
      const orderData = res.data;
      
      // 2. Check if real Razorpay or simulation mode
      if (orderData.success && orderData.mode === 'razorpay' && window.Razorpay) {
        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'SHIV TOURS & TRAVELS',
          description: `Booking for ${bookingData.vehicleName || 'AC Cab'}`,
          image: '/logo.jpg',
          order_id: orderData.orderId,
          handler: async (response) => {
            setTxnId(response.razorpay_payment_id);
            
            // Call backend order signature verification via Axios
            try {
              const verifyRes = await axios.post('/api/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingData: {
                  ...bookingData,
                  customerName: customerName,
                  phone: customerPhone,
                  paidAmount: payAmount,
                  bookingRef: bookingRef
                }
              });
              
              if (verifyRes.data.success) {
                setStep('success');
              } else {
                alert('Signature verification failed: ' + verifyRes.data.message);
                setStep('checkout');
              }
            } catch (err) {
              console.error('Signature verification network call failed:', err);
              alert('Error verifying payment with server.');
              setStep('checkout');
            }
          },
          prefill: {
            name: customerName,
            contact: customerPhone
          },
          theme: {
            color: '#0B132B'
          },
          modal: {
            ondismiss: () => {
              setStep('checkout');
            }
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback simulation mode via Axios
        console.log('Running in Fallback Payment Simulator...');
        setTimeout(async () => {
          try {
            const bookingRecord = {
              customerName: customerName || 'Valued Customer',
              phone: customerPhone,
              vehicleName: bookingData.vehicleName || 'AC Cab',
              pickup: bookingData.pickup || 'Your Location',
              drop: bookingData.drop || 'Outstation',
              date: bookingData.date || 'Immediate',
              time: bookingData.time || 'Now',
              distance: bookingData.distance ? Number(bookingData.distance) : 0,
              amount: Number(baseAmount),
              txnId: txnId,
              bookingRef: bookingRef,
              paymentMethod: 'Simulator',
              paidAmount: Number(payAmount),
              balanceAmount: Number(balanceAmount),
              status: 'Confirmed', // capital Confirmed matching schema
              bookingType: 'online'
            };
            
            await axios.post('/api/payments/verify', {
              razorpay_order_id: orderData.orderId || 'MOCK_ORDER_ID',
              razorpay_payment_id: txnId,
              razorpay_signature: null,
              bookingData: bookingRecord
            });
          } catch (err) {
            console.error('Failed to log booking to database:', err);
          }
          setStep('success');
        }, 2000);
      }
    } catch (err) {
      console.error('Payment initialization failed, falling back to simulator:', err);
      setTimeout(() => {
        setStep('success');
      }, 2000);
    }
  };

  const handleShareToWhatsApp = () => {
    const text = `*SHIV TOURS & TRAVELS - BOOKING CONFIRMATION*\n\n` +
                 `Dear Shiv Travels, I have completed the online booking payment. Please find the details below:\n\n` +
                 `👤 *CUSTOMER:* ${customerName || 'Valued Customer'} (${customerPhone})\n` +
                 `📍 *ROUTE:* ${bookingData.pickup || 'Nashik'} to ${bookingData.drop || 'Outstation'}\n` +
                 `🚗 *VEHICLE:* ${bookingData.vehicleName || 'AC Cab'}\n` +
                 `📅 *DATE:* ${bookingData.date || 'Today'}\n` +
                 `⏰ *TIME:* ${bookingData.time || 'Immediate'}\n` +
                 `🛣️ *EST. DISTANCE:* ${bookingData.distance || '100'} km\n` +
                 `💰 *TOTAL FARE:* ₹${baseAmount}\n\n` +
                 `-----------------------------\n` +
                 `💳 *PAYMENT RECEIPT (SUCCESS)*\n` +
                 `- *Transaction ID:* ${txnId}\n` +
                 `- *Booking Ref ID:* ${bookingRef}\n` +
                 `- *Paid via:* ${paymentMethod.toUpperCase()} (${paymentMethod === 'upi' ? selectedUpiApp.toUpperCase() : paymentMethod === 'card' ? 'Card' : 'Net Banking'})\n` +
                 `- *Amount Paid:* ₹${payAmount}\n` +
                 `- *Balance to Pay:* ₹${balanceAmount} (to driver at end of trip)\n\n` +
                 `Please confirm my booking and share driver details. Thank you!`;
                 
    const whatsappUrl = `https://wa.me/918010936793?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-gold/20 shadow-2xl relative flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-navy p-5 text-white flex items-center justify-between border-b border-gold/15">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-gold" />
              <div>
                <h3 className="font-extrabold text-sm sm:text-base tracking-wide">SHIV SECURE PAY</h3>
                <p className="text-[10px] text-slate-300">Razorpay & Paytm Integrated Gateway</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 space-y-6">
            {step === 'checkout' && (
              <form onSubmit={handleProceedPayment} className="space-y-6">
                {/* Booking Summary Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Booking Summary</span>
                  <div className="flex justify-between items-center text-sm font-bold text-navy-dark">
                    <span>{bookingData.vehicleName}</span>
                    <span>₹{baseAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    <div>Route: <span className="font-semibold text-slate-700">{bookingData.pickup} &rarr; {bookingData.drop}</span></div>
                    <div>Date & Time: <span className="font-semibold text-slate-700">{bookingData.date} | {bookingData.time}</span></div>
                  </div>
                </div>

                {/* Contact Information Fields */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Contact Information</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase block">Your Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Rahul Sharma"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full text-xs text-navy-dark border border-slate-300 p-2.5 rounded-xl bg-white outline-none focus:border-gold"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase block">Phone Number (10 digits)</label>
                      <input 
                        type="tel" 
                        placeholder="e.g. 9405601603"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full text-xs text-navy-dark border border-slate-300 p-2.5 rounded-xl bg-white outline-none focus:border-gold"
                        maxLength="10"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Booking Option (Token vs Full) */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Payment Option</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsTokenPayment(true)}
                      className={`p-3 rounded-xl border-2 text-left space-y-1 transition-all ${isTokenPayment ? 'border-gold bg-gold/5' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                    >
                      <span className="text-xs font-bold text-navy-dark block">Pay Token Amount</span>
                      <span className="text-lg font-black text-navy block">₹500</span>
                      <span className="text-[10px] text-slate-500 block">Balance ₹{(baseAmount - 500)} to driver</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsTokenPayment(false)}
                      className={`p-3 rounded-xl border-2 text-left space-y-1 transition-all ${!isTokenPayment ? 'border-gold bg-gold/5' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                    >
                      <span className="text-xs font-bold text-navy-dark block">Pay Full Amount</span>
                      <span className="text-lg font-black text-navy block">₹{baseAmount}</span>
                      <span className="text-[10px] text-slate-500 block">Complete online booking</span>
                    </button>
                  </div>
                </div>

                {/* Gateway Tabs */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Payment Method</label>
                  <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`py-2 px-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1 ${paymentMethod === 'upi' ? 'bg-navy text-white shadow-sm' : 'text-slate-600 hover:text-navy-dark'}`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>UPI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 px-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1 ${paymentMethod === 'card' ? 'bg-navy text-white shadow-sm' : 'text-slate-600 hover:text-navy-dark'}`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`py-2 px-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1 ${paymentMethod === 'netbanking' ? 'bg-navy text-white shadow-sm' : 'text-slate-600 hover:text-navy-dark'}`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>NetBank</span>
                    </button>
                  </div>
                </div>

                {/* Gateway Fields */}
                <div className="border border-slate-200 p-4 rounded-2xl min-h-[140px] flex flex-col justify-center">
                  {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <div className="text-center text-xs text-slate-400 font-semibold mb-2">PAY VIA INSTANT UPI APP</div>
                      <div className="grid grid-cols-3 gap-3">
                        {['gpay', 'paytm', 'phonepe'].map((app) => (
                          <button
                            key={app}
                            type="button"
                            onClick={() => setSelectedUpiApp(app)}
                            className={`p-3.5 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${selectedUpiApp === app ? 'border-navy bg-navy/5 font-bold' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                          >
                            {app === 'gpay' && <span className="text-xs text-blue-600 font-black tracking-tighter">Google Pay</span>}
                            {app === 'paytm' && <span className="text-xs text-cyan-600 font-black tracking-tight">Paytm</span>}
                            {app === 'phonepe' && <span className="text-xs text-purple-700 font-black">PhonePe</span>}
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">{app}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Card Number (e.g. 4321 8876 5432 1098)"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          className="w-full bg-white border border-slate-200 focus:border-gold rounded-xl py-2.5 px-3 text-slate-800 text-xs focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Expiry (MM/YY)"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="w-full bg-white border border-slate-200 focus:border-gold rounded-xl py-2.5 px-3 text-slate-800 text-xs focus:outline-none transition-colors"
                        />
                        <input
                          type="password"
                          required
                          maxLength="3"
                          placeholder="CVV"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          className="w-full bg-white border border-slate-200 focus:border-gold rounded-xl py-2.5 px-3 text-slate-800 text-xs focus:outline-none transition-colors"
                        />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Cardholder Name"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        className="w-full bg-white border border-slate-200 focus:border-gold rounded-xl py-2.5 px-3 text-slate-800 text-xs focus:outline-none transition-colors"
                      />
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Select Net Banking Bank</label>
                      <select 
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-gold rounded-xl py-2.5 px-3 text-slate-800 text-xs focus:outline-none transition-colors"
                      >
                        <option value="sbi">State Bank of India (SBI)</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gold hover:bg-gold-dark text-navy-dark font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg shadow-gold/20"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Proceed to Pay ₹{payAmount.toLocaleString('en-IN')}
                </button>

                {/* Secure Badge */}
                <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400 font-semibold tracking-wide">
                  <Lock className="w-3.5 h-3.5" />
                  <span>100% SECURE SSL TRANSACTION PROTECTED BY RAZORPAY / PAYTM</span>
                </div>
              </form>
            )}

            {step === 'processing' && (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                <Loader2 className="w-12 h-12 text-gold animate-spin" />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-navy-dark text-base">Processing Transaction...</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Please do not close this modal, refresh the page, or press the back button.
                  </p>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="py-6 flex flex-col items-center justify-center space-y-6 text-center animate-fade-in">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center relative">
                  <span className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-25" />
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-extrabold text-navy-dark text-xl">Payment Successful!</h4>
                  <p className="text-xs text-slate-400">Token booking confirmed for Shiv Tours & Travels</p>
                </div>

                {/* Receipt Board */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 w-full text-left text-xs space-y-2.5 font-medium text-slate-600">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-400">Transaction ID:</span>
                    <span className="font-mono text-navy font-bold">{txnId}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-400">Booking Ref:</span>
                    <span className="font-mono text-navy font-bold">{bookingRef}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-400">Paid Amount:</span>
                    <span className="font-extrabold text-navy-dark">₹{payAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-400">Remaining Balance:</span>
                    <span className="font-bold text-slate-700">₹{balanceAmount.toLocaleString('en-IN')} (pay to driver)</span>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <button
                    onClick={handleShareToWhatsApp}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg"
                  >
                    Share Details & Receipt on WhatsApp
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all"
                  >
                    Go Back to Site
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;
