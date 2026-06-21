import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  pickup: { type: String, required: true },
  drop: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  vehicleType: { type: String, required: true },
  amount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  balanceAmount: { type: Number, required: true },
  paymentStatus: { type: String, default: 'Pending' },
  txnId: { type: String },
  bookingRef: { type: String },
  paymentMethod: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', BookingSchema);
