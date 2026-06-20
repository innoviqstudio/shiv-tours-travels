import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  seats: { type: Number, required: true },
  ac: { type: String, required: true },
  rate: { type: Number, required: true },
  rateAc: { type: Number },
  luggage: { type: String },
  features: [{ type: String }],
  bestFor: { type: String },
  img: { type: String }
});

export default mongoose.model('Vehicle', VehicleSchema);
