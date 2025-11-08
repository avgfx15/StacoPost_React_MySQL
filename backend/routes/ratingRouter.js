import express from 'express';
import {
  ratePostController,
  rateCommentController,
  getPostRatingStatsController,
  getCommentRatingStatsController,
  getUserPostRatingStatusController,
  getUserCommentRatingStatusController,
} from '../controllers/ratingController.js';
import { authenticateToken } from '../controllers/authController.js';

const router = express.Router();

// + Rate a Post
router.post('/posts/:postId', authenticateToken, ratePostController);

// + Rate a Comment
router.post('/comments/:commentId', authenticateToken, rateCommentController);

// / Get Rating Stats for a Post
router.get('/posts/:postId/stats', getPostRatingStatsController);

// / Get Rating Stats for a Comment
router.get('/comments/:commentId/stats', getCommentRatingStatsController);

// / Get User's Rating Status for a Post
router.get(
  '/posts/:postId/status',
  authenticateToken,
  getUserPostRatingStatusController
);

// / Get User's Rating Status for a Comment
router.get(
  '/comments/:commentId/status',
  authenticateToken,
  getUserCommentRatingStatusController
);

export default router;
