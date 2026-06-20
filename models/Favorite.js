import mongoose from 'mongoose'

const favoriteSchema = new mongoose.Schema({
  tenantEmail: { type: String, required: true },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  propertyTitle: { type: String },
  propertyLocation: { type: String },
  propertyImage: { type: String },
  rent: { type: Number },
  rentType: { type: String },
}, { timestamps: true })

export default mongoose.model('Favorite', favoriteSchema)