const { success, error } = require('../helpers/responseApi')
const { validationResult } = require('express-validator')
const User = require('../models/User')
const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

/**
 * @desc    Get logged user
 * @method  GET api/users
 * @access  Private
 */
exports.getLoggedUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')

    res
      .status(200)
      .json(success(`Hello ${req.user.name}`, { user }, res.statusCode))
  } catch (err) {
    console.error(err.message)
    res.status(401).json(error('Unauthorized', res.statusCode))
  }
}

/**
 * @desc    Authenticate user and get token
 * @method  POST api/users
 * @access  Public
 */
exports.login = async (req, res) => {
  // Errors validation
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() })

  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    // Check for email
    if (!user)
      return res.status(400).json(error("Email doesn't exists", res.statusCode))

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch)
      return res
        .status(400)
        .json(error("Password doesn't match", res.statusCode))

    const payload = {
      user: {
        id: user.id,
        name: user.name
      }
    }

    // Send token
    jwt.sign(
      payload,
      config.get('jwtSecret'),
      {
        expiresIn: 36000
      },
      (err, token) => {
        if (err) throw err
        res.status(200).json(
          success('Login successs', {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              date: user.date
            },
            token
          })
        )
      }
    )
  } catch (err) {
    console.error(err.message)
    res.status(500).json(error('Server Error', res.statusCode))
  }
}
