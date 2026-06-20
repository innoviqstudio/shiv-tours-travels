import express from 'express';
import Booking from '../models/Booking.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// GET all bookings (Admin Only - Protected)
// Supports search (name, phone, ref ID) and status filtering
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (status && status !== 'all') {
      // Direct status match
      query.status = status;
    }

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { bookingRef: { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create booking (Public)
router.post('/', async (req, res) => {
  try {
    const { 
      customerName, phone, pickup, drop, date, time, 
      vehicleType, amount, paidAmount, balanceAmount, 
      paymentMethod, txnId, bookingType, status 
    } = req.body;

    const bookingId = 'BK_' + Date.now();
    const bookingRef = 'SHIV_' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const newBooking = new Booking({
      bookingId,
      customerName: customerName || 'Valued Customer',
      phone: phone || '',
      pickup: pickup || 'Your Location',
      drop: drop || 'Destination',
      date: date || 'Immediate',
      time: time || 'Now',
      vehicleType: vehicleType || 'AC Cab',
      amount: Number(amount) || 0,
      paidAmount: Number(paidAmount) || 0,
      balanceAmount: Number(balanceAmount) || 0,
      paymentStatus: Number(paidAmount) > 0 ? 'Paid' : 'Pending',
      txnId: txnId || 'N/A',
      bookingRef,
      paymentMethod: paymentMethod || 'WhatsApp',
      bookingType: bookingType || 'whatsapp',
      status: status || 'Pending',
      createdAt: new Date()
    });

    await newBooking.save();
    res.json({ success: true, booking: newBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update booking status (Admin Only - Protected)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE booking (Admin Only - Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
