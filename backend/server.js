const express = require('express')
const app = express()
const path = require('path')
const connectDB = require('./config/db')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000
const cors = require('cors')

// Middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Connect to database
connectDB()

app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/user'))
app.use('/api/contacts', require('./routes/contact'))

// Deploy
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  )
}

app.listen(PORT, () => console.log(`Server started at port ${PORT}`))
