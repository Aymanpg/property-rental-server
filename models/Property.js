import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'studio', 'office'],
    required: true
  },
  rent: { type: Number, required: true },
  rentType: {
    type: String,
    enum: ['monthly', 'weekly', 'daily'],
    default: 'monthly'
  },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  propertySize: { type: String },
  amenities: [{ type: String }],
  images: [{ type: String }],
  extraFeatures: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionFeedback: { type: String, default: '' },
  ownerInfo: {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    photo: { type: String },
  },
  ownerEmail: { type: String, required: true },
}, { timestamps: true })

export default mongoose.model('Property', propertySchema)