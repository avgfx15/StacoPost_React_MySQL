import express from 'express';
import {
  createCommentForPostController,
  deleteCommentByIdController,
  getAllCommentsByPostIdController,
} from '../controllers/commentController.js';
import { authenticateToken } from '../controllers/authController.js';

const commentRouter = express.Router();

commentRouter.get('/test', (req, res) =>
  res.status(200).send('commentRouter Test!')
);

// / Get All Comments By Post ID
commentRouter.get('/:postId', getAllCommentsByPostIdController);

// + Create New Comment For a Post By Post ID
commentRouter.post(
  '/:postId',
  authenticateToken,
  createCommentForPostController
);

// - Delete Comment By Comment ID
commentRouter.delete(
  '/:commentId',
  authenticateToken,
  deleteCommentByIdController
);

export default commentRouter;
