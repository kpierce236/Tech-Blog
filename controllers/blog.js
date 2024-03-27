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

    //console.log(postData);

   const post = postData.get({ plain: true });

    const isOwnPost = post.user.id === req.session.user_id;

     // Fetch all comments for the post
     const comments = await Comment.findAll({ where: { blogPostId }, include: User });
    
     // Check if each comment belongs to the authenticated user
     const userComments = comments.map(comment => {
       return {
         ...comment.get({ plain: true }),
         isOwnComment: comment.user.id === req.session.user_id
       };
     });

     console.log(userComments);

    res.render('post', { post, isOwnPost, comments: userComments});
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
    console.log(comment);

    res.redirect(`/post/${blogPostId}`)
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


// Route to delete a comment
router.delete('/post/:postId/comment/:commentId', async (req, res) => {
  try {
      const { postId, commentId } = req.params;

      // Check if the comment exists
      const comment = await Comment.findByPk(commentId);
      if (!comment) {
          return res.status(404).json({ error: 'Comment not found' });
      }

      // Check if the comment belongs to the authenticated user
      if (comment.userId !== req.session.user_id) {
          return res.status(403).json({ error: 'Unauthorized to delete this comment' });
      }

      // Delete the comment
      await comment.destroy();

      res.status(200).send('Delete Sucessful');
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
