import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/associations.js';

// Register User
export const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      username,
      email,
      password: hashedPassword,
    };

    const savedUser = await User.create(newUser);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        profileImage: savedUser.profileImage,
        role: savedUser.role,
        mobileNo: savedUser.mobileNo,
        gender: savedUser.gender,
        age: savedUser.age,
        facebook: savedUser.facebook,
        linkedin: savedUser.linkedin,
        instagram: savedUser.instagram,
        whatsapp: savedUser.whatsapp,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        profileImage: savedUser.profileImage,
        role: savedUser.role,
        mobileNo: savedUser.mobileNo,
        gender: savedUser.gender,
        age: savedUser.age,
        facebook: savedUser.facebook,
        linkedin: savedUser.linkedin,
        instagram: savedUser.instagram,
        whatsapp: savedUser.whatsapp,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login User
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        mobileNo: user.mobileNo,
        gender: user.gender,
        age: user.age,
        facebook: user.facebook,
        linkedin: user.linkedin,
        instagram: user.instagram,
        whatsapp: user.whatsapp,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
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
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout User (client-side token removal)
export const logoutController = async (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || 'your-secret-key',
    (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      req.user = user; // Attach user info to request
      next();
    }
  );
};

// Middleware to optionally verify JWT token
export const optionalAuthenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return next(); // No token, just continue
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || 'your-secret-key',
    (err, user) => {
      if (!err) {
        req.user = user; // Attach user info to request
      }
      next(); // Continue even if token is invalid
    }
  );
};

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      mobileNo: user.mobileNo,
      gender: user.gender,
      age: user.age,
      facebook: user.facebook,
      linkedin: user.linkedin,
      instagram: user.instagram,
      whatsapp: user.whatsapp,
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};
