import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Booking from '../models/Booking.js';

const router = express.Router();

const rzpKeyId = process.env.RAZORPAY_KEY_ID;
const rzpKeySecret = process.env.RAZORPAY_KEY_SECRET;
let rzpInstance = null;

if (rzpKeyId && rzpKeySecret) {
  try {
    rzpInstance = new Razorpay({
      key_id: rzpKeyId,
      key_secret: rzpKeySecret
    });
  } catch (err) {
    console.error('Error initializing Razorpay inside payment route:', err);
  }
}

// POST create Razorpay order
router.post('/order', async (req, res) => {
  const { amount } = req.body;
  const amountVal = Number(amount) || 500; // default to 500 INR token
  
  if (rzpInstance) {
    try {
      const order = await rzpInstance.orders.create({
        amount: Math.round(amountVal * 100), // paise (1 INR = 100 paise)
        currency: 'INR',
        receipt: 'rcpt_' + Date.now().toString().slice(-8),
        payment_capture: 1
      });
      return res.json({
        success: true,
        mode: 'razorpay',
        key: rzpKeyId,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency
      });
    } catch (err) {
      console.error('Razorpay order creation error, falling back to simulator:', err);
    }
  }
  
  // Fallback / Simulation mode if credentials are missing
  res.json({
    success: true,
    mode: 'simulation',
    amount: amountVal,
    currency: 'INR',
    orderId: 'MOCK_ORDER_' + Math.random().toString(36).substring(2, 10).toUpperCase()
  });
});

// POST verify payment and save booking
router.post('/verify', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      bookingData 
    } = req.body;
    
    // Verify signature if running in real Razorpay mode
    if (rzpInstance && razorpay_signature && razorpay_order_id && razorpay_payment_id) {
      const hmac = crypto.createHmac('sha256', rzpKeySecret);
      hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
      const generatedSignature = hmac.digest('hex');
      
      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Invalid payment signature' });
      }
    }
    
    // Save booking to MongoDB
    const amountVal = bookingData.amount || 2500;
    const paidAmountVal = bookingData.paidAmount || 500;
    const balanceAmountVal = amountVal - paidAmountVal;
    
    const bookingId = 'BK_' + Date.now();
    const bookingRef = bookingData.bookingRef || ('SHIV_' + Math.random().toString(36).substring(2, 8).toUpperCase());

    const newBooking = new Booking({
      bookingId,
      customerName: bookingData.customerName || 'Valued Customer',
      phone: bookingData.phone || '',
      pickup: bookingData.pickup || 'Your Location',
      drop: bookingData.drop || 'Outstation',
      date: bookingData.date || 'Immediate',
      time: bookingData.time || 'Now',
      vehicleType: bookingData.vehicleName || 'AC Cab',
      amount: Number(amountVal),
      paidAmount: Number(paidAmountVal),
      balanceAmount: Number(balanceAmountVal),
      paymentStatus: Number(paidAmountVal) > 0 ? 'Paid' : 'Pending',
      txnId: razorpay_payment_id || ('TXN_SHIV_' + Math.floor(1000000000 + Math.random() * 9000000000)),
      bookingRef,
      paymentMethod: rzpInstance ? 'Razorpay' : 'Simulator',
      bookingType: bookingData.bookingType || 'online',
      status: bookingData.status || 'Confirmed',
      createdAt: new Date()
    });
    
    await newBooking.save();
    res.json({ success: true, booking: newBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
