// routes/blog.js
const express = require('express');
const router = express.Router();
const { BlogPost, Comment, User } = require('../models');
const { withAuth } = require('../utils/withAuth');

// Get all blog posts for the dashboard
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const blogData = await BlogPost.findAll({include: { model: User }});

    const blogPosts = blogData.map((item) => item.get({ plain: true }));

    res.render('dashboard', { blogPosts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Get all blog posts for the home page
router.get('/', withAuth, async (req, res) => {
  try {
    const userId = req.session.user_id; // Assuming the user object is available in the request after authentication
    console.log(userId);
    const blogData = await BlogPost.findAll({ where: { userId },include: { model: User } });

    console.log(blogData);

    const blogPosts = blogData.map((item) => item.get({ plain: true }));

    res.render('home', { blogPosts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Get a specific blog post
router.get('/post/:id', withAuth, async (req, res) => {
  try {
    const blogPostId = req.params.id;
    const postData = await BlogPost.findByPk(blogPostId, { include: [ {model: Comment, include: User}, {model: User} ]});

    console.log(postData);

    const post = postData.get({ plain: true });

    console.log(post);

    res.render('post', { post });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Create a new blog post
router.post('/post', withAuth, async (req, res) => {
  try {
    const userId = req.session.user_id;
    console.log(userId);
    const { title, content } = req.body;
    const blogPost = await BlogPost.create({ title, content, userId });
    console.log(blogPost);
    res.redirect(`post/${blogPost.id}`)
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Create a new comment
router.post('/post/:postId/comment', withAuth, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const { content } = req.body;
    const blogPostId = req.params.postId;
    const comment = await Comment.create({ content, userId, blogPostId });

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
    const { blogPostId, commentId } = req.params;
    const comment = await Comment.findOne({ where: { id: commentId, blogPostId } });
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
    const blogPostId = req.params.postId;
    const comments = await Comment.findAll({ where: { blogPostId } });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Delete a blog post
router.delete('/post/:id', withAuth, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const blogPostId = req.params.id;

    const blogPost = await BlogPost.findOne({ where: { id: blogPostId, userId } });

    if (!blogPost) {
      return res.status(404).send('Blog post not found');
    }

    await blogPost.destroy();

    res.status(200).send('Blog post deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

//Update a blog post
router.put('/post/:id', withAuth, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const blogPostId = req.params.id;
    const { title, content } = req.body;

    const blogPost = await BlogPost.findOne({ where: { id: blogPostId, userId } });

    if (!blogPost) {
      return res.status(404).send('Blog post not found');
    }

    blogPost.title = title;
    blogPost.content = content;
    await blogPost.save();

    res.status(200).send('Blog post updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
