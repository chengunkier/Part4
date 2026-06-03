const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return response.status(401).json({
      error: 'token missing'
    })
  }

  const token = authorization.replace('Bearer ', '')

  let decodedToken

  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (error) {
    return response.status(401).json({
      error: 'token invalid'
    })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(401).json({
      error: 'user not found'
    })
  }

  request.user = user

  next()
}

module.exports = userExtractor