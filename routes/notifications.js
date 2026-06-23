import express from 'express'
import Notification from '../models/Notification.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

// Get user's notifications
router.get('/:email', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userEmail: req.params.email })
      .sort({ createdAt: -1 })
      .limit(20)
    res.json(notifications)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Mark all as read
router.patch('/:email/read-all', verifyToken, async (req, res) => {
  try {
    await Notification.updateMany({ userEmail: req.params.email }, { isRead: true })
    res.json({ message: 'All marked as read' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Mark one as read
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true })
    res.json({ message: 'Marked as read' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router