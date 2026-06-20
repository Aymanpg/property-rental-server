import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, photo, role } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const newUser = await User.create({ name, email, photo, role: role || 'tenant' })
    const token = jwt.sign(
      { email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.status(201).json({ token, user: newUser })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { name, email, photo } = req.body
    let user = await User.findOne({ email })
    if (!user) {
      user = await User.create({ name, email, photo, role: 'tenant' })
    }
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.status(200).json({ token, user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router