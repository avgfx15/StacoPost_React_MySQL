import { Comment, User } from '../models/associations.js';

// / Get All Comments By Post ID
export const getAllCommentsByPostIdController = async (req, res) => {
  try {
    const postId = req.params.postId;

    // ~ Logic to get all comments by postId from the database
    const allComments = await Comment.findAll({
      where: { commentPost_id: postId },
      include: [
        {
          model: User,
          as: 'commentUser',
          attributes: ['username', 'email', 'profileImage'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    // Build comment tree recursively
    const buildCommentTree = (comments, parentId = null) => {
      return comments
        .filter((comment) => comment.parentComment_id === parentId)
        .map((comment) => ({
          ...comment.toJSON(),
          replies: buildCommentTree(comments, comment.id),
        }));
    };

    const commentTree = buildCommentTree(allComments);

    res.status(200).json(commentTree);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};

// + Create Comment For a Post
export const createCommentForPostController = async (req, res) => {
  try {
    // / Get user from JWT token
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'You are Unauthorized' });
    }

    // ? Find User from UserModel
    const userExist = await User.findByPk(user.id);

    if (!userExist) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    // $ Get Post ID from params
    const postId = req.params.postId;
    const { commentDesc, parentCommentId } = req.body;
    const commentUser_id = userExist.id;

    // ~ Logic to create a new comment for the post
    const newComment = {
      commentUser_id,
      commentPost_id: postId,
      commentDesc,
      parentComment_id: parentCommentId || null,
    };

    const savedComment = await Comment.create(newComment);
    res.status(201).json(savedComment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};

// - Delete Comment By ID
export const deleteCommentByIdController = async (req, res) => {
  try {
    // Get user from JWT token
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'You are Unauthorized' });
    }

    // Find User from UserModel
    const userExist = await User.findByPk(user.id);

    if (!userExist) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    // $ Get Comment ID from params
    const { commentId } = req.params;

    // % Check if comment exists
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Allow delete if user is the author or admin
    if (comment.commentUser_id !== userExist.id && userExist.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Unauthorized to delete this comment' });
    }

    await Comment.destroy({ where: { id: commentId } });
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};
