import { Rating, User, Post, Comment } from '../models/associations.js';

// + Rate a Post
export const ratePostController = async (req, res) => {
  try {
    const { postId } = req.params;
    const { rating } = req.body; // 1-5
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'You are Unauthorized' });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: 'Rating must be between 1 and 5' });
    }

    // Find User
    const userExist = await User.findByPk(user.id);
    if (!userExist) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    // Find Post
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post Not Found' });
    }

    // Check if user already rated this post
    const existingRating = await Rating.findOne({
      where: {
        ratingUser_id: userExist.id,
        ratingPost_id: postId,
      },
    });

    if (existingRating) {
      // Update the rating
      existingRating.rating = rating;
      await existingRating.save();
      return res
        .status(200)
        .json({ message: 'Rating updated', rating: existingRating });
    } else {
      // Create new rating
      const newRating = await Rating.create({
        ratingUser_id: userExist.id,
        ratingPost_id: postId,
        rating,
      });
      return res.status(201).json(newRating);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};

// + Rate a Comment
export const rateCommentController = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { rating } = req.body; // 1-5
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'You are Unauthorized' });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: 'Rating must be between 1 and 5' });
    }

    // Find User
    const userExist = await User.findByPk(user.id);
    if (!userExist) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    // Find Comment
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment Not Found' });
    }

    // Check if user already rated this comment
    const existingRating = await Rating.findOne({
      where: {
        ratingUser_id: userExist.id,
        ratingComment_id: commentId,
      },
    });

    if (existingRating) {
      // Update the rating
      existingRating.rating = rating;
      await existingRating.save();
      return res
        .status(200)
        .json({ message: 'Rating updated', rating: existingRating });
    } else {
      // Create new rating
      const newRating = await Rating.create({
        ratingUser_id: userExist.id,
        ratingComment_id: commentId,
        rating,
      });
      return res.status(201).json(newRating);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};

// / Get Average Rating and Count for a Post
export const getPostRatingStatsController = async (req, res) => {
  try {
    const { postId } = req.params;

    const ratings = await Rating.findAll({
      where: { ratingPost_id: postId },
      attributes: ['rating'],
    });

    if (ratings.length === 0) {
      return res.status(200).json({ averageRating: 0, totalRatings: 0 });
    }

    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = (totalRating / ratings.length).toFixed(1);

    res.status(200).json({
      averageRating: Number.parseFloat(averageRating),
      totalRatings: ratings.length,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};

// / Get Average Rating and Count for a Comment
export const getCommentRatingStatsController = async (req, res) => {
  try {
    const { commentId } = req.params;

    const ratings = await Rating.findAll({
      where: { ratingComment_id: commentId },
      attributes: ['rating'],
    });

    if (ratings.length === 0) {
      return res.status(200).json({ averageRating: 0, totalRatings: 0 });
    }

    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = (totalRating / ratings.length).toFixed(1);

    res.status(200).json({
      averageRating: parseFloat(averageRating),
      totalRatings: ratings.length,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};

// / Get User's Rating Status for a Post
export const getUserPostRatingStatusController = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(200).json({ rating: null });
    }

    const rating = await Rating.findOne({
      where: {
        ratingUser_id: user.id,
        ratingPost_id: postId,
      },
    });

    res.status(200).json({ rating: rating ? rating.rating : null });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};

// / Get User's Rating Status for a Comment
export const getUserCommentRatingStatusController = async (req, res) => {
  try {
    const { commentId } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(200).json({ rating: null });
    }

    const rating = await Rating.findOne({
      where: {
        ratingUser_id: user.id,
        ratingComment_id: commentId,
      },
    });

    res.status(200).json({ rating: rating ? rating.rating : null });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};
