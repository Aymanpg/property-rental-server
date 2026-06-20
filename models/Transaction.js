import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  propertyId: { type: String, required: true },
  propertyTitle: { type: String, required: true },
  tenantEmail: { type: String, required: true },
  tenantName: { type: String, required: true },
  ownerEmail: { type: String, required: true },
  ownerName: { type: String, required: true },
  amount: { type: Number, required: true },
  bookingId: { type: String },
}, { timestamps: true })

export default mongoose.model('Transaction', transactionSchema)