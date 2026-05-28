const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const helper = require('./test_helper.test')

const api = supertest(app)

describe('when there are initially some blogs saved', () => {

  beforeEach(async () => {

    await Blog.deleteMany({})
    await User.deleteMany({})

    const user = new User({
      username: 'root',
      name: 'Superuser',
      passwordHash: 'secret'
    })

    const savedUser = await user.save()

    const blogObjects = helper.initialBlogs.map(blog => {
      return new Blog({
        ...blog,
        user: savedUser._id
      })
    })

    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs have id field instead of _id', async () => {
    const response = await api.get('/api/blogs')

    const blog = response.body[0]

    assert(blog.id)
    assert.strictEqual(blog._id, undefined)
  })

  describe('addition of a new blog', () => {

    test('succeeds with valid data', async () => {

      const users = await helper.usersInDb()

      const newBlog = {
        title: 'Async Await Testing',
        author: 'Zach',
        url: 'www.async.com',
        likes: 15,
        user: users[0].id
      }

      await api
        .post('/api/blogs')
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

      const users = await helper.usersInDb()

      const newBlog = {
        title: 'No Likes Blog',
        author: 'Zach',
        url: 'www.nolikes.com',
        user: users[0].id
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

      assert.strictEqual(response.body.likes, 0)
    })

    test('fails with status 400 if title is missing', async () => {

      const users = await helper.usersInDb()

      const newBlog = {
        author: 'Zach',
        url: 'www.test.com',
        likes: 10,
        user: users[0].id
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })

    test('fails with status 400 if url is missing', async () => {

      const users = await helper.usersInDb()

      const newBlog = {
        title: 'Missing URL Blog',
        author: 'Zach',
        likes: 10,
        user: users[0].id
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})