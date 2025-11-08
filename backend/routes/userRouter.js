import express from 'express';
import {
  getAllSavedPostsController,
  savePostForUserController,
  getUserProfileController,
  updateUserProfileController,
  deleteUserAccountController,
  getAllUsersController,
} from '../controllers/userControllers.js';
import { authenticateToken } from '../controllers/authController.js';

const userRouter = express.Router();

// / Get All Saved Posts for a User
userRouter.get('/savedposts', authenticateToken, getAllSavedPostsController);

userRouter.patch('/savepost', authenticateToken, savePostForUserController);

// / Get User Profile
userRouter.get('/profile', authenticateToken, getUserProfileController);

// + Update User Profile
userRouter.put('/profile', authenticateToken, updateUserProfileController);

// - Delete User Account
userRouter.delete('/account', authenticateToken, deleteUserAccountController);

// / Get All Users (Admin Only)
userRouter.get('/all', authenticateToken, getAllUsersController);

export default userRouter;
