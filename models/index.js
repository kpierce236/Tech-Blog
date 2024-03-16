// models/index.js
const User = require('./User');
const BlogPost = require('./BlogPost');
const Comment = require('./Comment');

// Define associations
User.hasMany(BlogPost, { foreignKey: 'userId' });
BlogPost.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

BlogPost.hasMany(Comment, { foreignKey: 'blogPostId' });
Comment.belongsTo(BlogPost, { foreignKey: 'blogPostId' });

module.exports = { User, BlogPost, Comment };
