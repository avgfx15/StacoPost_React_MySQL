import express from 'express';
import {
  registerController,
  loginController,
  logoutController,
  authenticateToken,
  googleAuth,
  googleAuthCallback,
  googleAuthSuccess,
  facebookAuth,
  facebookAuthCallback,
  facebookAuthSuccess,
  linkedinAuth,
  linkedinAuthCallback,
  linkedinAuthSuccess,
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

// Social Auth Routes (only if credentials are configured)
// Google
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  authRouter.get('/google', googleAuth);
  authRouter.get('/google/callback', googleAuthCallback, googleAuthSuccess);
} else {
  authRouter.get('/google', (req, res) =>
    res.status(501).json({ message: 'Google OAuth not configured' })
  );
  authRouter.get('/google/callback', (req, res) =>
    res.status(501).json({ message: 'Google OAuth not configured' })
  );
}

// Facebook
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  authRouter.get('/facebook', facebookAuth);
  authRouter.get(
    '/facebook/callback',
    facebookAuthCallback,
    facebookAuthSuccess
  );
} else {
  authRouter.get('/facebook', (req, res) =>
    res.status(501).json({ message: 'Facebook OAuth not configured' })
  );
  authRouter.get('/facebook/callback', (req, res) =>
    res.status(501).json({ message: 'Facebook OAuth not configured' })
  );
}

// LinkedIn
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  authRouter.get('/linkedin', linkedinAuth);
  authRouter.get(
    '/linkedin/callback',
    linkedinAuthCallback,
    linkedinAuthSuccess
  );
} else {
  authRouter.get('/linkedin', (req, res) =>
    res.status(501).json({ message: 'LinkedIn OAuth not configured' })
  );
  authRouter.get('/linkedin/callback', (req, res) =>
    res.status(501).json({ message: 'LinkedIn OAuth not configured' })
  );
}

export default authRouter;
