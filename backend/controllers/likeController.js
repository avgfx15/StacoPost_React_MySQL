import { Like, User, Post, Comment } from '../models/associations.js';

// + Like or Dislike a Post
export const likeOrDislikePostController = async (req, res) => {
  try {
    const { postId } = req.params;
    const { type } = req.body; // 'like' or 'dislike'
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'You are Unauthorized' });
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

    // Check if user already liked/disliked this post
    const existingLike = await Like.findOne({
      where: {
        likeUser_id: userExist.id,
        likePost_id: postId,
      },
    });

    if (existingLike) {
      if (existingLike.type === type) {
        // Remove the like/dislike if same type
        await existingLike.destroy();
        return res.status(200).json({ message: `${type} removed` });
      } else {
        // Update to new type
        existingLike.type = type;
        await existingLike.save();
        return res.status(200).json({ message: `Changed to ${type}` });
      }
    } else {
      // Create new like/dislike
      const newLike = await Like.create({
        likeUser_id: userExist.id,
        likePost_id: postId,
        type,
      });
      return res.status(201).json(newLike);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};

// + Like or Dislike a Comment
export const likeOrDislikeCommentController = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { type } = req.body; // 'like' or 'dislike'
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'You are Unauthorized' });
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

    // Check if user already liked/disliked this comment
    const existingLike = await Like.findOne({
      where: {
        likeUser_id: userExist.id,
        likeComment_id: commentId,
      },
    });

    if (existingLike) {
      if (existingLike.type === type) {
        // Remove the like/dislike if same type
        await existingLike.destroy();
        return res.status(200).json({ message: `${type} removed` });
      } else {
        // Update to new type
        existingLike.type = type;
        await existingLike.save();
        return res.status(200).json({ message: `Changed to ${type}` });
      }
    } else {
      // Create new like/dislike
      const newLike = await Like.create({
        likeUser_id: userExist.id,
        likeComment_id: commentId,
        type,
      });
      return res.status(201).json(newLike);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};

// / Get Like Counts for a Post
export const getPostLikeCountsController = async (req, res) => {
  try {
    const { postId } = req.params;

    const likes = await Like.count({
      where: { likePost_id: postId, type: 'like' },
    });

    const dislikes = await Like.count({
      where: { likePost_id: postId, type: 'dislike' },
    });

    res.status(200).json({ likes, dislikes });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};

// / Get Like Counts for a Comment
export const getCommentLikeCountsController = async (req, res) => {
  try {
    const { commentId } = req.params;

    const likes = await Like.count({
      where: { likeComment_id: commentId, type: 'like' },
    });

    const dislikes = await Like.count({
      where: { likeComment_id: commentId, type: 'dislike' },
    });

    res.status(200).json({ likes, dislikes });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};

// / Get User's Like Status for a Post
export const getUserPostLikeStatusController = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(200).json({ status: null });
    }

    const like = await Like.findOne({
      where: {
        likeUser_id: user.id,
        likePost_id: postId,
      },
    });

    res.status(200).json({ status: like ? like.type : null });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};

// / Get User's Like Status for a Comment
export const getUserCommentLikeStatusController = async (req, res) => {
  try {
    const { commentId } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(200).json({ status: null });
    }

    const like = await Like.findOne({
      where: {
        likeUser_id: user.id,
        likeComment_id: commentId,
      },
    });

    res.status(200).json({ status: like ? like.type : null });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};
