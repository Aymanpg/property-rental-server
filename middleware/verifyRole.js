import User from '../models/User.js'

const verifyRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const email = req.user.email
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: `Forbidden - Requires role: ${roles.join(' or ')}` })
      }
      req.userRole = user.role
      next()
    } catch (error) {
      res.status(500).json({ message: 'Server error in role verification' })
    }
  }
}

export default verifyRole