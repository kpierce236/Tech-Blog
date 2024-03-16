// routes/blog.js
const express = require('express');
const router = express.Router();
const { BlogPost, Comment } = require('../models');
const { withAuth } = require('../utils/withAuth');

// Get all blog posts for the dashboard
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const blogPosts = await BlogPost.findAll();
    res.render('dashboard', { blogPosts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Get all blog posts for the home page
router.get('/', withAuth, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user object is available in the request after authentication
    const blogPosts = await BlogPost.findAll({ where: { userId } });
    res.render('home', { blogPosts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Get a specific blog post
router.get('/post/:id', withAuth, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await BlogPost.findByPk(postId, { include: Comment });
    res.render('post', { post });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Create a new blog post
router.post('/post', withAuth, async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const blogPost = await BlogPost.create({ title, content, userId });
    res.status(201).send('Blog post created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Create a new comment
router.post('/post/:postId/comment', withAuth, async (req, res) => {
  try {
    const { content, userId } = req.body;
    const postId = req.params.postId;
    const comment = await Comment.create({ content, userId, postId });
    res.status(201).send('Comment created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Update a comment
router.put('/post/:postId/comment/:commentId', withAuth, async (req, res) => {
  try {
    const { content } = req.body;
    const { postId, commentId } = req.params;
    const comment = await Comment.findOne({ where: { id: commentId, postId } });
    if (!comment) {
      return res.status(404).send('Comment not found');
    }
    comment.content = content;
    await comment.save();
    res.status(200).send('Comment updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Get all comments for a blog post
router.get('/post/:postId/comments', withAuth, async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.findAll({ where: { postId } });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
