const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const helper = require('./test_helper.test')

const api = supertest(app)

let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  await api.post('/api/users').send({
    username: 'root',
    name: 'Superuser',
    password: 'sekret'
  })

  const loginResponse = await api.post('/api/login').send({
    username: 'root',
    password: 'sekret'
  })

  token = loginResponse.body.token

  const userInDb = await User.findOne({ username: 'root' })

  const blogObjects = helper.initialBlogs.map(blog =>
    new Blog({
      ...blog,
      user: userInDb._id
    })
  )

  await Blog.insertMany(blogObjects)
})

describe('when there are initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(
      response.body.length,
      helper.initialBlogs.length
    )
  })

  test('blogs have id field instead of _id', async () => {
    const response = await api.get('/api/blogs')

    const blog = response.body[0]

    assert(blog.id)
    assert.strictEqual(blog._id, undefined)
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Async Await Testing',
        author: 'Zach',
        url: 'www.async.com',
        likes: 15
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(
        blogsAtEnd.length,
        helper.initialBlogs.length + 1
      )
    })

    test('if likes property is missing, it defaults to 0', async () => {
      const newBlog = {
        title: 'No Likes Blog',
        author: 'Zach',
        url: 'www.nolikes.com'
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      assert.strictEqual(response.body.likes, 0)
    })

    test('fails with status 400 if title is missing', async () => {
      const newBlog = {
        author: 'Zach',
        url: 'www.test.com',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })

    test('fails with status 400 if url is missing', async () => {
      const newBlog = {
        title: 'Missing URL Blog',
        author: 'Zach',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })

    test('fails with status 401 if token is not provided', async () => {
      const newBlog = {
        title: 'Unauthorized Blog',
        author: 'Zach',
        url: 'www.unauthorized.com',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})