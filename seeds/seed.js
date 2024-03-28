// seeders/seed.js
const { User, Comment, BlogPost } = require('../models');
const sequelize = require('../config/connection');

const seedDatabase = async () => {
  try {
    // Sync the models with the database schema
    await sequelize.sync({ force: true }); // Set force: true to drop tables if they exist and re-create them

    // Create users
    const users = await User.bulkCreate([
      { username: 'john_doe', password: 'password1' },
      { username: 'jane_smith', password: 'password2' },
      { username: 'bob_jackson', password: 'password3' },
    ]);

    // Create blog posts
    const blogPosts = await BlogPost.bulkCreate([
      { title: 'First Post', content: 'This is the content of the first post.', UserId: users[0].id },
      { title: 'Second Post', content: 'This is the content of the second post.', UserId: users[1].id },
      { title: 'Third Post', content: 'This is the content of the third post.', UserId: users[2].id },
    ]);

    // Create comments
    await Comment.bulkCreate([
      { content: 'Great post!', BlogPostId: blogPosts[0].id, UserId: users[1].id },
      { content: 'I enjoyed reading this.', BlogPostId: blogPosts[0].id, UserId: users[2].id },
      { content: 'Nice work!', BlogPostId: blogPosts[1].id, UserId: users[0].id },
      { content: 'Looking forward to more.', BlogPostId: blogPosts[1].id, UserId: users[2].id },
      { content: 'Interesting thoughts.', BlogPostId: blogPosts[2].id, UserId: users[0].id },
      { content: 'I agree with this.', BlogPostId: blogPosts[2].id, UserId: users[1].id },
    ]);

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0); // Exit the process after seeding
  }
};

seedDatabase();
