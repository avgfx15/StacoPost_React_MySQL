import { User, Post, Comment, Like } from '../models/associations.js';

// / Get All Saved Posts for a User
export const getAllSavedPostsController = async (req, res) => {
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

    const savedPostIds = Array.isArray(userExist.savedPosts)
      ? userExist.savedPosts
      : [];

    if (savedPostIds.length === 0) {
      return res.status(200).json({ savedPosts: [] });
    }

    // Fetch complete post data for saved post IDs
    const savedPosts = await Post.findAll({
      where: { id: savedPostIds },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['username', 'email', 'profileImage'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ savedPosts });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};

// / Get User Profile
export const getUserProfileController = async (req, res) => {
  try {
    // Get user from JWT token
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'You are Unauthorized' });
    }

    // Find User from UserModel
    const userExist = await User.findByPk(user.id, {
      attributes: [
        'id',
        'username',
        'email',
        'profileImage',
        'mobileNo',
        'gender',
        'age',
        'facebook',
        'linkedin',
        'instagram',
        'whatsapp',
        'role',
        'createdAt',
      ],
    });

    if (!userExist) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    res.status(200).json({ user: userExist });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};

// + Update User Profile
export const updateUserProfileController = async (req, res) => {
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

    const {
      profileImage,
      mobileNo,
      gender,
      age,
      facebook,
      linkedin,
      instagram,
      whatsapp,
    } = req.body;

    // Update user profile
    await userExist.update({
      profileImage,
      mobileNo,
      gender,
      age,
      facebook,
      linkedin,
      instagram,
      whatsapp,
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: userExist.id,
        username: userExist.username,
        email: userExist.email,
        profileImage: userExist.profileImage,
        mobileNo: userExist.mobileNo,
        gender: userExist.gender,
        age: userExist.age,
        facebook: userExist.facebook,
        linkedin: userExist.linkedin,
        instagram: userExist.instagram,
        whatsapp: userExist.whatsapp,
        role: userExist.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};

// - Delete User Account
export const deleteUserAccountController = async (req, res) => {
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

    // Find guest user to transfer content to
    const guestUser = await User.findOne({ where: { username: 'guest' } });

    if (!guestUser) {
      return res.status(500).json({
        message:
          'Cannot delete account: No guest user found to transfer content to',
      });
    }

    // Transfer all user's posts to guest
    await Post.update(
      { author_id: guestUser.id },
      { where: { author_id: user.id } }
    );

    // Transfer all user's comments to guest
    await Comment.update(
      { commentUser_id: guestUser.id },
      { where: { commentUser_id: user.id } }
    );

    // Transfer all user's likes/dislikes to guest
    await Like.update(
      { likeUser_id: guestUser.id },
      { where: { likeUser_id: user.id } }
    );

    // Delete the user account
    await User.destroy({ where: { id: user.id } });

    res.status(200).json({
      message:
        'Account deleted successfully. All your posts, comments, and likes have been transferred to guest user.',
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};

// / Get All Users (Admin Only)
export const getAllUsersController = async (req, res) => {
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

    // Check if user is admin
    if (userExist.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Get all users with post and comment counts
    const allUsers = await User.findAll({
      attributes: [
        'id',
        'username',
        'email',
        'profileImage',
        'mobileNo',
        'gender',
        'age',
        'role',
        'createdAt',
      ],
      include: [
        {
          model: Post,
          as: 'posts',
          attributes: ['id'],
        },
        {
          model: Comment,
          as: 'comments',
          attributes: ['id'],
        },
      ],
    });

    // Format the response with counts
    const usersWithCounts = allUsers.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      mobileNo: user.mobileNo,
      gender: user.gender,
      age: user.age,
      role: user.role,
      createdAt: user.createdAt,
      totalPosts: user.posts ? user.posts.length : 0,
      totalComments: user.comments ? user.comments.length : 0,
    }));

    res.status(200).json({ users: usersWithCounts });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};

// + Save Post for a User
export const savePostForUserController = async (req, res) => {
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

    // Get Post ID from body
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    const savedPosts = Array.isArray(userExist.savedPosts)
      ? userExist.savedPosts
      : [];
    const isPostSaved = savedPosts.includes(postId);

    // Logic to save post for the user
    if (isPostSaved) {
      const updatedSavedPosts = savedPosts.filter((id) => id !== postId);
      await userExist.update({ savedPosts: updatedSavedPosts });

      return res.status(200).json({ message: 'Post is Unsaved Now!' });
    } else {
      const updatedSavedPosts = [...savedPosts, postId];
      await userExist.update({ savedPosts: updatedSavedPosts });

      return res.status(200).json({ message: 'Post is Saved Now!' });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
};
