const express = require('express')
const mongoose = require('mongoose')

const config = require('./utils/config')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch(err => {
    logger.error('error connecting to MongoDB:', err.message)
    process.exit(1) // Exit the process if the database connection fails
  })

app.use(express.json())
app.use(middleware.requestLogger)

app.use(middleware.tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

app.use(middleware.errorHandler)

// Catch-all for unknown endpoints
app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})

module.exports = app