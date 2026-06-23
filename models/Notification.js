import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['booking_confirmed', 'booking_approved', 'booking_rejected', 'property_approved', 'property_rejected'],
    required: true 
  },
  isRead: { type: Boolean, default: false },
  link: { type: String, default: '' }
}, { timestamps: true })

export default mongoose.model('Notification', notificationSchema)