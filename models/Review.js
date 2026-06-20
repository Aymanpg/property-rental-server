import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  tenantEmail: { type: String, required: true },
  tenantName: { type: String, required: true },
  tenantPhoto: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true })

export default mongoose.model('Review', reviewSchema)