// | import express

import express from 'express';

// | Import CORS
import cors from 'cors';

// | Import Passport and Session
import passport from 'passport';
import session from 'express-session';

// | Import Router
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import postRouter from './routes/postRouter.js';
import commentRouter from './routes/commentRouter.js';
import categoryRouter from './routes/categoryRouter.js';
import likeRouter from './routes/likeRouter.js';
import ratingRouter from './routes/ratingRouter.js';
import contactRouter from './routes/contactRouter.js';
import whatsappWebhookRouter from './routes/whatsappWebhookRouter.js';

// | Import DB Connect
import dbConnect from './DB/dbConnect.js';

// | Import uploadAuthController
import { uploadAuthController } from './controllers/postControllers.js';

// ` Configure App
const app = express();

// ` CORS Middleware
app.use(cors(process.env.CLIENT_URL));
// @ Port Declare
const port = 3000;

// Webhooks removed

// ` Session middleware for Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
  })
);

// ` Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ` Configure Middleware For JSON format
app.use(express.json({ limit: '10mb' }));

// ` Configure Middleware For URL Encoded format

// allow cross-origin requests
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ` Upload Auth Route (before clerkMiddleware to allow unauthenticated access)
app.get('/posts/upload-auth', uploadAuthController);

// Clerk middleware removed

// ` Configure middleware router
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
app.use('/categories', categoryRouter);
app.use('/likes', likeRouter);
app.use('/ratings', ratingRouter);
app.use('/contact', contactRouter);
app.use('/whatsapp', whatsappWebhookRouter);

app.use((error, req, res, next) => {
  if (!res.headersSent) {
    res.status(error.status || 500);

    res.json({
      message: error.message || 'Something went wrong!',
      status: error.status || 500,
      stack: error.stack,
      error: error,
      name: error.name,
    });
  }
});

// ` Configure base route
app.get('/', (req, res) => res.status(200).send('Hello World!'));

// ` Configure app lister with port and DB Configure with app start up
app.listen(port, async () => {
  try {
    console.log(`Blogpost app listening on port ${port}!`);
    await dbConnect();
  } catch (error) {
    console.log(`Error in Blogpost app` + error);
  }
});
