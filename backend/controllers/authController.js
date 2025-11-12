import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
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

// Passport Google Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ where: { googleId: profile.id } });
          if (!user) {
            // Check if user exists with same email
            const existingUser = await User.findOne({
              where: { email: profile.emails[0].value },
            });
            if (existingUser) {
              // Link Google account to existing user
              existingUser.googleId = profile.id;
              existingUser.provider = 'google';
              existingUser.profileImage = profile.photos[0].value;
              await existingUser.save();
              return done(null, existingUser);
            } else {
              // Create new user
              user = await User.create({
                googleId: profile.id,
                username: profile.displayName.replace(/\s+/g, '').toLowerCase(),
                email: profile.emails[0].value,
                profileImage: profile.photos[0].value,
                provider: 'google',
              });
            }
          }
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// Passport Facebook Strategy (only if credentials are provided)
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  console.log('Login using Facebook ');
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'emails', 'photos', 'name'],
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('Facebook Login');
        try {
          let user = await User.findOne({ where: { facebookId: profile.id } });
          if (!user) {
            const existingUser = await User.findOne({
              where: { email: profile.emails[0].value },
            });
            if (existingUser) {
              existingUser.facebookId = profile.id;
              existingUser.provider = 'facebook';
              existingUser.profileImage = profile.photos[0].value;
              await existingUser.save();
              return done(null, existingUser);
            } else {
              user = await User.create({
                facebookId: profile.id,
                username: profile.displayName.replace(/\s+/g, '').toLowerCase(),
                email: profile.emails[0].value,
                profileImage: profile.photos[0].value,
                provider: 'facebook',
              });
            }
          }
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// Passport LinkedIn Strategy (only if credentials are provided)
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  console.log('Login With LinkedIn');

  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: `${
          process.env.BACKEND_URL || 'http://localhost:3000'
        }/auth/linkedin/callback`,
        scope: ['openid', 'profile', 'email'],
        state: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Your user find/create logic here, using profile data
          let user = await User.findOne({ where: { linkedinId: profile.id } });
          console.log(user);

          const email = profile.emails?.[0]?.value || '';

          if (!email) {
            // Handle missing email, e.g., skip, prompt for manual email, or log
            console.error(
              'No email received from provider, cannot query by email.'
            );
            // Optionally, return error or proceed without email matching
            return done(new Error('Email not available from provider'), null);
          }

          // Defensive check
          if (typeof email === 'undefined' || email === '') {
            // Do not query database with undefined email
            return done(
              new Error('No valid email found from LinkedIn profile'),
              null
            );
          }

          if (!user) {
            const existingUser = await User.findOne({
              where: { email: profile.emails?.[0]?.value },
            });
            if (existingUser) {
              existingUser.linkedinId = profile.id;
              existingUser.provider = 'linkedin';
              existingUser.profileImage = profile.photos?.[0]?.value || '';
              await existingUser.save();
              return done(null, existingUser);
            } else {
              user = await User.create({
                linkedinId: profile.id,
                username: profile.displayName.replace(/\s+/g, '').toLowerCase(),
                email: profile.emails?.[0]?.value || '',
                profileImage: profile.photos?.[0]?.value || '',
                provider: 'linkedin',
              });
            }
          }
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // passport.use(
  //   new LinkedInStrategy(
  //     {
  //       clientID: process.env.LINKEDIN_CLIENT_ID,
  //       clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  //       callbackURL: `${
  //         process.env.BACKEND_URL || 'http://localhost:3000'
  //       }/auth/linkedin/callback`,
  //       scope: ['openid', 'profile', 'email'],
  //       state: true,
  //     },
  //     async (accessToken, refreshToken, profile, done) => {
  //       console.log('LinkedIn Profile:', profile);
  //       try {
  //         let user = await User.findOne({ where: { linkedinId: profile.id } });
  //         console.log('Existing LinkedIn User:', user);
  //         if (!user) {
  //           const existingUser = await User.findOne({
  //             where: { email: profile.emails[0].value },
  //           });
  //           if (existingUser) {
  //             existingUser.linkedinId = profile.id;
  //             existingUser.provider = 'linkedin';
  //             existingUser.profileImage = profile.photos[0].value;
  //             await existingUser.save();
  //             return done(null, existingUser);
  //           } else {
  //             user = await User.create({
  //               linkedinId: profile.id,
  //               username: profile.displayName.replace(/\s+/g, '').toLowerCase(),
  //               email: profile.emails[0].value,
  //               profileImage: profile.photos[0].value,
  //               provider: 'linkedin',
  //             });
  //           }
  //         }
  //         return done(null, user);
  //       } catch (error) {
  //         console.error('LinkedIn Auth Error:', error);
  //         return done(error, null);
  //       }
  //     }
  //   )
  // );
}

// Serialize and deserialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Social Auth Controllers
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

export const googleAuthCallback = passport.authenticate('google', {
  failureRedirect: '/login',
});

export const googleAuthSuccess = (req, res) => {
  const token = generateToken(req.user);
  res.cookie('auth_token', token, {
    httpOnly: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  });
  res.redirect(`${process.env.CLIENT_URL}/auth/success`);
};

export const facebookAuth = passport.authenticate('facebook', {
  scope: ['email', 'public_profile'],
});

export const facebookAuthCallback = passport.authenticate('facebook', {
  failureRedirect: '/login',
});

export const facebookAuthSuccess = (req, res) => {
  const token = generateToken(req.user);
  res.cookie('auth_token', token, {
    httpOnly: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  });
  res.redirect(`${process.env.CLIENT_URL}/auth/success`);
};

export const linkedinAuth = passport.authenticate('linkedin', {
  scope: ['openid', 'profile', 'email'],
});

export const linkedinAuthCallback = passport.authenticate('linkedin', {
  failureRedirect: '/login',
});

export const linkedinAuthSuccess = (req, res) => {
  const token = generateToken(req.user);
  res.cookie('auth_token', token, {
    httpOnly: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  });
  res.redirect(`${process.env.CLIENT_URL}/auth/success`);
};
