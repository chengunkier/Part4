const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'First blog',
    author: 'John Doe',
    url: 'http://example.com/1',
    likes: 5
  },
  {
    title: 'Second blog',
    author: 'Jane Doe',
    url: 'http://example.com/2',
    likes: 10
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb
}