const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  console.log('HEADERS:', req.headers['content-type'])
  console.log('BODY RECEIVED:', req.body)

  const body = req.body

  // 🔥 safety check
  if (!body) {
    return res.status(400).json({ error: 'request body missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()

  console.log('SAVED BLOG:', savedBlog)

  res.status(201).json(savedBlog)
})

module.exports = blogsRouter