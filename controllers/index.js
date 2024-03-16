// routes/index.js
const express = require('express');
const router = express.Router();

// Import individual route files
const authRoutes = require('./auth');
const blogRoutes = require('./blog');

// Use the individual route files
router.use('/', authRoutes);
router.use('/', blogRoutes);

module.exports = router;
