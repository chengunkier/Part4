const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
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

// 3. check id field exists (MAIN TASK 4.9)
test('blogs have id field instead of _id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert.strictEqual(blog._id, undefined)
    assert.strictEqual(blog.id !== undefined, true)
  })
})

after(async () => {
  await mongoose.connection.close()
})