import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  approved: { type: Boolean, default: true },
  date: { type: String, default: 'Just now' },
  ownerReply: {
    name: { type: String },
    date: { type: String },
    comment: { type: String }
  }
});

export default mongoose.model('Review', ReviewSchema);
