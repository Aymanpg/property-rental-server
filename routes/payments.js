import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import Stripe from 'stripe'
import Transaction from '../models/Transaction.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

const stripeKey = process.env.STRIPE_SECRET_KEY

if (!stripeKey) {
  console.error('❌ STRIPE_SECRET_KEY not found in .env file')
}

const stripe = stripeKey ? new Stripe(stripeKey) : null

// Create Payment Intent
router.post('/create-intent', verifyToken, async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({
        message: 'Stripe is not configured'
      })
    }

    const { amount } = req.body

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd'
    })

    res.json({
      clientSecret: paymentIntent.client_secret
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: error.message
    })
  }
})

// Save Transaction
router.post('/save-transaction', verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body)

    res.status(201).json(transaction)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: error.message
    })
  }
})

// Admin - All Transactions
router.get('/admin/all', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })

    res.json(transactions)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: error.message
    })
  }
})

// Owner Transactions
router.get('/owner/:email', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      ownerEmail: req.params.email
    }).sort({ createdAt: -1 })

    res.json(transactions)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: error.message
    })
  }
})

export default router