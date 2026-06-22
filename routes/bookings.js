import express from 'express'
import Booking from '../models/Booking.js'
import verifyToken from '../middleware/verifyToken.js'
import verifyRole from '../middleware/verifyRole.js'

const router = express.Router()

// CREATE BOOKING
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      propertyId,
      moveInDate,
      tenantEmail,
      propertyImage
    } = req.body

    // Check existing booking
    const existingBooking = await Booking.findOne({
      propertyId,
      tenantEmail,
      bookingStatus: { $in: ['pending', 'approved'] }
    })

    if (existingBooking) {
      return res.status(400).json({
        message: 'You already have an active booking for this property'
      })
    }

    // Check date clash
    const clashingBooking = await Booking.findOne({
      propertyId,
      moveInDate,
      bookingStatus: { $in: ['pending', 'approved'] }
    })

    if (clashingBooking) {
      return res.status(400).json({
        message: 'This property is already booked for that move-in date. Please choose a different date.'
      })
    }

    // CREATE BOOKING (now includes propertyImage safely)
    const booking = await Booking.create({
      ...req.body,
      propertyImage: propertyImage || ''
    })

    res.status(201).json(booking)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// ADMIN ALL BOOKINGS
router.get('/admin/all', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// OWNER BOOKINGS
router.get('/owner/:email', verifyToken, verifyRole('owner'), async (req, res) => {
  try {
    const bookings = await Booking.find({ ownerEmail: req.params.email })
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// TENANT BOOKINGS
router.get('/tenant/:email', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ tenantEmail: req.params.email })
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// UPDATE STATUS (OWNER)
router.patch('/:id/status', verifyToken, verifyRole('owner'), async (req, res) => {
  try {
    const { bookingStatus } = req.body

    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { bookingStatus },
      { new: true }
    )

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// PAYMENT UPDATE
router.patch('/:id/payment', verifyToken, async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: 'paid' },
      { new: true }
    )

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router