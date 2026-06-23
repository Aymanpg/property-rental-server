import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import propertyRoutes from './routes/properties.js'
import bookingRoutes from './routes/bookings.js'
import paymentRoutes from './routes/payments.js'
import reviewRoutes from './routes/reviews.js'
import favoriteRoutes from './routes/favorites.js'
import notificationRoutes from './routes/notifications.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000


app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://property-rental-client.vercel.app'
  ],
  credentials: true
}))
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err))

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/properties', propertyRoutes)
app.use('/bookings', bookingRoutes)
app.use('/payments', paymentRoutes)
app.use('/reviews', reviewRoutes)
app.use('/favorites', favoriteRoutes)
app.use('/notifications', notificationRoutes)

app.get('/', (req, res) => {
  res.send('Property Rental API is running ✅')
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})