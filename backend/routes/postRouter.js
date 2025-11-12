// | import express
import express from 'express';

// ` Configure PostRouter
const postRouter = express.Router();

// | import Controller
import {
  createPostController,
  deletePostController,
  featurePostController,
  getAllPostController,
  getSinglePostBySlugController,
  activatePostController,
} from '../controllers/postControllers.js';
import {
  authenticateToken,
  optionalAuthenticateToken,
} from '../controllers/authController.js';
import increaseVisit from '../middleware/increaseVisit.js';

// ` Configure Routes
// & Test Route
postRouter.get('/test', (req, res) => res.status(200).send('postRouter Test!'));

// / Get All Post Route
postRouter.get('/', optionalAuthenticateToken, getAllPostController);

// / Get Single Post By Slug
postRouter.get('/:slug', increaseVisit, getSinglePostBySlugController);

// + Create Post
postRouter.post('/', authenticateToken, createPostController);

// - Delete Post By Id
postRouter.delete('/:postId', authenticateToken, deletePostController);

// + Feature the post
postRouter.patch('/feature', authenticateToken, featurePostController);

// + Activate/Deactivate the post
postRouter.patch('/activate', authenticateToken, activatePostController);

// ~ Export postRouter
export default postRouter;
