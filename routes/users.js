import express from 'express'
import User from '../models/User.js'
import verifyToken from '../middleware/verifyToken.js'
import verifyRole from '../middleware/verifyRole.js'

const router = express.Router()

router.get('/', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:email', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch('/:id/role', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const { role } = req.body
    const updated = await User.findByIdAndUpdate(
      req.params.id, { role }, { new: true }
    )
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/:email', verifyToken, async (req, res) => {
  try {
    const { name, photo } = req.body
    const updated = await User.findOneAndUpdate(
      { email: req.params.email },
      { name, photo },
      { new: true }
    )
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router