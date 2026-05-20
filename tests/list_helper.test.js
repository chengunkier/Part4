const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)

  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)

    assert.strictEqual(result, 5)
  })

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])

    assert.strictEqual(result, 0)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [
      { title: 'First blog', likes: 5 },
      { title: 'Second blog', likes: 10 },
      { title: 'Third blog', likes: 7 }
    ]

    const result = listHelper.totalLikes(blogs)

    assert.strictEqual(result, 22)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      _id: '1',
      title: 'First blog',
      author: 'John',
      url: 'first.com',
      likes: 7
    },
    {
      _id: '2',
      title: 'Second blog',
      author: 'Mary',
      url: 'second.com',
      likes: 12
    },
    {
      _id: '3',
      title: 'Third blog',
      author: 'Mike',
      url: 'third.com',
      likes: 5
    }
  ]

  test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)

    assert.deepStrictEqual(result, {
      _id: '2',
      title: 'Second blog',
      author: 'Mary',
      url: 'second.com',
      likes: 12
    })
  })
})

describe('most blogs', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Robert C. Martin',
      likes: 5
    },
    {
      title: 'Blog 2',
      author: 'Robert C. Martin',
      likes: 10
    },
    {
      title: 'Blog 3',
      author: 'Edsger W. Dijkstra',
      likes: 7
    }
  ]

  test('author with most blogs is returned correctly', () => {
    const result = listHelper.mostBlogs(blogs)

    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 2
    })
  })
})