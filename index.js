require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.set('strictQuery', false)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Blog API is running</h1>')
})

app.get('/api/blogs', (request, response) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })

  blog.save()
    .then((savedBlog) => {
      response.status(201).json(savedBlog)
    })
})

const PORT = process.env.PORT || 3003

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)})