import User from './userModel.js';
import Post from './postModel.js';
import Comment from './commentModel.js';
import Category from './categoryModel.js';
import Like from './likeModel.js';
import Rating from './ratingModel.js';

// Define associations
User.hasMany(Post, { foreignKey: 'author_id', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

Category.hasMany(Post, { foreignKey: 'category_id', as: 'posts' });
Post.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

User.hasMany(Comment, { foreignKey: 'commentUser_id', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'commentUser_id', as: 'commentUser' });

Post.hasMany(Comment, { foreignKey: 'commentPost_id', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'commentPost_id', as: 'commentPost' });

Comment.hasMany(Comment, { foreignKey: 'parentComment_id', as: 'replies' });
Comment.belongsTo(Comment, {
  foreignKey: 'parentComment_id',
  as: 'parentComment',
});

// Like associations
User.hasMany(Like, { foreignKey: 'likeUser_id', as: 'likes' });
Like.belongsTo(User, { foreignKey: 'likeUser_id', as: 'likeUser' });

Post.hasMany(Like, { foreignKey: 'likePost_id', as: 'likes' });
Like.belongsTo(Post, { foreignKey: 'likePost_id', as: 'likePost' });

Comment.hasMany(Like, { foreignKey: 'likeComment_id', as: 'likes' });
Like.belongsTo(Comment, { foreignKey: 'likeComment_id', as: 'likeComment' });

// Rating associations
User.hasMany(Rating, { foreignKey: 'ratingUser_id', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'ratingUser_id', as: 'ratingUser' });

Post.hasMany(Rating, { foreignKey: 'ratingPost_id', as: 'ratings' });
Rating.belongsTo(Post, { foreignKey: 'ratingPost_id', as: 'ratingPost' });

Comment.hasMany(Rating, { foreignKey: 'ratingComment_id', as: 'ratings' });
Rating.belongsTo(Comment, {
  foreignKey: 'ratingComment_id',
  as: 'ratingComment',
});

export { User, Post, Comment, Category, Like, Rating };
