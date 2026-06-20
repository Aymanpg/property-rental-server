import express from 'express'
import Property from '../models/Property.js'
import verifyToken from '../middleware/verifyToken.js'
import verifyRole from '../middleware/verifyRole.js'

const router = express.Router()

router.get('/featured', async (req, res) => {
  try {
    const properties = await Property.find({ status: 'approved' })
      .sort({ createdAt: -1 }).limit(6)
    res.json(properties)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/admin/all', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 })
    res.json(properties)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/owner/:email', verifyToken, verifyRole('owner', 'admin'), async (req, res) => {
  try {
    const properties = await Property.find({ ownerEmail: req.params.email })
      .sort({ createdAt: -1 })
    res.json(properties)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const { location, propertyType, minPrice, maxPrice, sort, page = 1, limit = 9 } = req.query
    const query = { status: 'approved' }
    if (location) query.location = { $regex: location, $options: 'i' }
    if (propertyType) query.propertyType = propertyType
    if (minPrice || maxPrice) {
      query.rent = {}
      if (minPrice) query.rent.$gte = Number(minPrice)
      if (maxPrice) query.rent.$lte = Number(maxPrice)
    }
    let sortOption = {}
    if (sort === 'low') sortOption = { rent: 1 }
    else if (sort === 'high') sortOption = { rent: -1 }
    else sortOption = { createdAt: -1 }
    const skip = (Number(page) - 1) * Number(limit)
    const total = await Property.countDocuments(query)
    const properties = await Property.find(query)
      .sort(sortOption).skip(skip).limit(Number(limit))
    res.json({ properties, total, page: Number(page), totalPages: Math.ceil(total / limit) })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
    if (!property) return res.status(404).json({ message: 'Property not found' })
    res.json(property)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', verifyToken, verifyRole('owner'), async (req, res) => {
  try {
    const property = await Property.create(req.body)
    res.status(201).json(property)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/:id', verifyToken, verifyRole('owner', 'admin'), async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    )
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch('/:id/status', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const { status, rejectionFeedback } = req.body
    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      { status, rejectionFeedback: rejectionFeedback || '' },
      { new: true }
    )
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', verifyToken, verifyRole('owner', 'admin'), async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id)
    res.json({ message: 'Property deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router