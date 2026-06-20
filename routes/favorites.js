import express from 'express'
import Favorite from '../models/Favorite.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

router.post('/', verifyToken, async (req, res) => {
  try {
    const exists = await Favorite.findOne({
      tenantEmail: req.body.tenantEmail,
      propertyId: req.body.propertyId
    })
    if (exists) return res.status(400).json({ message: 'Already in favorites' })
    const favorite = await Favorite.create(req.body)
    res.status(201).json(favorite)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:email', verifyToken, async (req, res) => {
  try {
    const favorites = await Favorite.find({ tenantEmail: req.params.email })
      .sort({ createdAt: -1 })
    res.json(favorites)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Favorite.findByIdAndDelete(req.params.id)
    res.json({ message: 'Removed from favorites' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router