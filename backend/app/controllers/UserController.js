const { success, error } = require('../helpers/responseApi')
const { validationResult } = require('express-validator')
const config = require('config')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * @desc    Register user
 * @method  POST api/users
 * @access  Public
 */
exports.register = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return
  }

  const { name, email, password } = req.body

  try {
    // Check existed email
    let user = await User.findOne({ email })

    if (user) return res.status(400).json(error('Email already exists', 422))

    user = new User({
      name,
      email,
      password
    })

    // Hash password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    await user.save()

    const payload = {
      user: {
        id: user.id,
        name: user.name
      }
    }

    // Assign token from JWT
    jwt.sign(
      payload,
      config.get('jwtSecret'),
      {
        expiresIn: 36000
      },
      (err, token) => {
        if (err) throw err
        res.status(201).json(
          success(
            'User registered',
            {
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                date: user.date
              },
              token
            },
            res.statusCode
          )
        )
      }
    )
  } catch (err) {
    console.error(err.message)
    res.status(500).json(error('Server error'))
  }
}
