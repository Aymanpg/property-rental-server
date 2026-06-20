import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photo: { type: String, default: '' },
  role: {
    type: String,
    enum: ['tenant', 'owner', 'admin'],
    default: 'tenant'
  },
}, { timestamps: true })

export default mongoose.model('User', userSchema)