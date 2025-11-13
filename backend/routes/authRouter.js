import express from 'express';
import {
  registerController,
  loginController,
  logoutController,
  authenticateToken,
} from '../controllers/authController.js';
import { User } from '../models/associations.js';

const authRouter = express.Router();

// Register route
authRouter.post('/register', registerController);

// Login route
authRouter.post('/login', loginController);

// Logout route
authRouter.post('/logout', logoutController);

// Profile route
authRouter.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        'id',
        'username',
        'email',
        'profileImage',
        'role',
        'mobileNo',
        'gender',
        'age',
        'facebook',
        'linkedin',
        'instagram',
        'whatsapp',
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        mobileNo: user.mobileNo,
        gender: user.gender,
        age: user.age,
        facebook: user.facebook,
        linkedin: user.linkedin,
        instagram: user.instagram,
        whatsapp: user.whatsapp,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default authRouter;
