import express from 'express';
import {
  likeOrDislikePostController,
  likeOrDislikeCommentController,
  getPostLikeCountsController,
  getCommentLikeCountsController,
  getUserPostLikeStatusController,
  getUserCommentLikeStatusController,
} from '../controllers/likeController.js';
import { authenticateToken } from '../controllers/authController.js';

const router = express.Router();

// + Like or Dislike a Post
router.post('/posts/:postId', authenticateToken, likeOrDislikePostController);

// + Like or Dislike a Comment
router.post(
  '/comments/:commentId',
  authenticateToken,
  likeOrDislikeCommentController
);

// / Get Like Counts for a Post
router.get('/posts/:postId/counts', getPostLikeCountsController);

// / Get Like Counts for a Comment
router.get('/comments/:commentId/counts', getCommentLikeCountsController);

// / Get User's Like Status for a Post
router.get(
  '/posts/:postId/status',
  authenticateToken,
  getUserPostLikeStatusController
);

// / Get User's Like Status for a Comment
router.get(
  '/comments/:commentId/status',
  authenticateToken,
  getUserCommentLikeStatusController
);

export default router;
