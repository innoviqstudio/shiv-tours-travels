import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: String, required: true },
  img: { type: String },
  rating: { type: Number, default: 5 },
  description: { type: String },
  itinerary: [{ type: String }],
  includes: [{ type: String }],
  excludes: [{ type: String }]
});

export default mongoose.model('Package', PackageSchema);
