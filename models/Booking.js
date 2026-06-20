import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  propertyTitle: { type: String, required: true },
  propertyLocation: { type: String },
  tenantEmail: { type: String, required: true },
  tenantName: { type: String, required: true },
  ownerEmail: { type: String, required: true },
  moveInDate: { type: String, required: true },
  contactNumber: { type: String, required: true },
  additionalNotes: { type: String, default: '' },
  amount: { type: Number, required: true },
  bookingStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid'
  },
}, { timestamps: true })

export default mongoose.model('Booking', bookingSchema)