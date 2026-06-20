import express from 'express'
import Booking from '../models/Booking.js'
import verifyToken from '../middleware/verifyToken.js'
import verifyRole from '../middleware/verifyRole.js'

const router = express.Router()

router.post('/', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.create(req.body)
    res.status(201).json(booking)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/admin/all', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/owner/:email', verifyToken, verifyRole('owner'), async (req, res) => {
  try {
    const bookings = await Booking.find({ ownerEmail: req.params.email })
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/tenant/:email', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ tenantEmail: req.params.email })
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch('/:id/status', verifyToken, verifyRole('owner'), async (req, res) => {
  try {
    const { bookingStatus } = req.body
    const updated = await Booking.findByIdAndUpdate(
      req.params.id, { bookingStatus }, { new: true }
    )
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch('/:id/payment', verifyToken, async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id, { paymentStatus: 'paid' }, { new: true }
    )
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router