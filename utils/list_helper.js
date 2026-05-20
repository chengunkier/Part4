const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  // count blogs per author
  const authorCounts = _.countBy(blogs, 'author')

  // find author with max blogs
  let topAuthor = null
  let maxBlogs = 0

  for (const author in authorCounts) {
    if (authorCounts[author] > maxBlogs) {
      maxBlogs = authorCounts[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    blogs: maxBlogs
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}