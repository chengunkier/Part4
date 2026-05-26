const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')

const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)

  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash
  })

  await user.save()
})

test('creation succeeds with a fresh username', async () => {
  const usersAtStart = await User.find({})

  const newUser = {
    username: 'zach',
    name: 'Zach',
    password: 'secret123'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await User.find({})

  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

  const usernames = usersAtEnd.map(u => u.username)

  assert(usernames.includes('zach'))
})

test('creation fails if username is too short', async () => {
  const usersAtStart = await User.find({})

  const newUser = {
    username: 'ab',
    name: 'Short Username',
    password: 'secret123'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(result.body.error.includes('username must be at least 3 characters long'))

  const usersAtEnd = await User.find({})

  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('creation fails if password is too short', async () => {
  const usersAtStart = await User.find({})

  const newUser = {
    username: 'validuser',
    name: 'Short Password',
    password: '12'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(result.body.error.includes('password must be at least 3 characters long'))

  const usersAtEnd = await User.find({})

  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('creation fails with proper statuscode and message if username already exists', async () => {
  const usersAtStart = await User.find({})

  const newUser = {
    username: 'root',
    name: 'Duplicate User',
    password: 'secret123'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(result.body.error.includes('expected `username` to be unique'))

  const usersAtEnd = await User.find({})

  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

after(async () => {
  await mongoose.connection.close()
})