import express from 'express'
import Booking from '../models/Booking.js'
import verifyToken from '../middleware/verifyToken.js'
import verifyRole from '../middleware/verifyRole.js'
import Notification from '../models/Notification.js'

const router = express.Router()

// CREATE BOOKING
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      propertyId,
      moveInDate,
      tenantEmail,
      tenantName,
      ownerEmail,
      propertyTitle,
      propertyImage
    } = req.body

    // Check existing booking
    // ✅ Same tenant, same property, same date — block করো
const duplicateBooking = await Booking.findOne({
  propertyId,
  tenantEmail,
  moveInDate,
  bookingStatus: { $in: ['pending', 'approved'] }
})

if (duplicateBooking) {
  return res.status(400).json({
    message: 'You already have an active booking for this property on this date.'
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

    // CREATE BOOKING
    const booking = await Booking.create({
      ...req.body,
      propertyImage: propertyImage || ''
    })

    // =========================
    // 🔔 NOTIFICATION: TENANT
    // =========================
    await Notification.create({
      userEmail: tenantEmail,
      message: `Your booking for "${propertyTitle}" has been submitted and is pending approval.`,
      type: 'booking_confirmed',
      link: '/dashboard/tenant/bookings'
    })

    // =========================
    // 🔔 NOTIFICATION: OWNER
    // =========================
    await Notification.create({
      userEmail: ownerEmail,
      message: `New booking request for "${propertyTitle}" from ${tenantName}.`,
      type: 'booking_confirmed',
      link: '/dashboard/owner/booking-requests'
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

    // =========================
    // 🔔 NOTIFICATION: TENANT
    // =========================
    await Notification.create({
      userEmail: updated.tenantEmail,
      message:
        bookingStatus === 'approved'
          ? `Your booking for "${updated.propertyTitle}" has been approved! 🎉`
          : `Your booking for "${updated.propertyTitle}" has been rejected.`,
      type:
        bookingStatus === 'approved'
          ? 'booking_approved'
          : 'booking_rejected',
      link: '/dashboard/tenant/bookings'
    })

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