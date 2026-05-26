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

const nonExistingId = async () => {
  const blog = new Blog({ title: 'temp', url: 'www.temp.com' })
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId
}