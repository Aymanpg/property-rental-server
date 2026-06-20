import express from 'express'
import Review from '../models/Review.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

router.post('/', verifyToken, async (req, res) => {
  try {
    const review = await Review.create(req.body)
    res.status(201).json(review)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(4)
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:propertyId', async (req, res) => {
  try {
    const reviews = await Review.find({ propertyId: req.params.propertyId })
      .sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router