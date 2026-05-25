const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'First blog',
    author: 'John Doe',
    url: 'www.first.com',
    likes: 5
  },
  {
    title: 'Second blog',
    author: 'Jane Doe',
    url: 'www.second.com',
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