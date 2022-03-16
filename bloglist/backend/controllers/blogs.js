const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  // Return all blogs and populate username and name fields of user field
  const blogs = await Blog
    .find({}).populate('user', {
      username: 1, name: 1,
    }).populate('comments', {
      comment: 1,
    });

  response.json(blogs.map((blog) => blog.toJSON()));
});

// eslint-disable-next-line consistent-return
blogsRouter.post('/', userExtractor, async (request, response) => {
  const { body, token, user } = request;
  // If there is no token or object decoded from token does not contain
  // user's identity, return error status code
  if (!token || !user) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.json(savedBlog.toJSON());
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog
    .findById(request.params.id)
    .populate('user', {
      username: 1, name: 1,
    })
    .populate('comments', {
      comment: 1,
    });

  if (blog) {
    response.json(blog.toJSON());
  } else {
    response.status(404).end();
  }
});

// eslint-disable-next-line consistent-return
blogsRouter.put('/:id', async (request, response) => {
  const { body, token } = request;
  // If there is no token, return error status code
  if (!token) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  response.json(updatedBlog.toJSON());
});

// eslint-disable-next-line consistent-return
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const { token, user } = request;
  // If there is no token or object decoded from token does not contain
  // user's identity, return error status code
  if (!token || !user) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const blog = await Blog.findById(request.params.id);
  // If deleting a blog is attempted without a token or by a wrong user,
  // The operation should return a suitable status code
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  await Blog.deleteOne(blog);
  response.status(204).end();
});

// eslint-disable-next-line consistent-return
blogsRouter.post('/:id/comments', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  const { body, token } = request;
  // If there is no token or object decoded from token does not contain
  // blog's identity, return error status code
  if (!token) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  if (blog) {
    const comment = new Comment({
      comment: body.comment,
      date: new Date(),
      blog: blog._id,
    });

    const savedComment = await comment.save();

    blog.comments = blog.comments.concat(savedComment._id);
    await blog.save();

    response.json(savedComment.toJSON());
  } else {
    response.status(404).end();
  }
});

module.exports = blogsRouter;
