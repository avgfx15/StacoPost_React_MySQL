// | import express

import express from 'express';

// | Import CORS
import cors from 'cors';

// | Import Passport and Session
import passport from 'passport';
import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';

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
import sequelize from './DB/sequelize.js';

// | Import uploadAuthController
import { uploadAuthController } from './controllers/postControllers.js';

// ` Configure App
const app = express();

// ` CORS Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://stacopost-react-mysql.onrender.com',
  'https://stacodev.com',
  process.env.CLIENT_URL,
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders:
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
};
app.use(cors(corsOptions));
// @ Port Declare
const port = process.env.PORT || 3000;

// Webhooks removed

// ` Session middleware for Passport with Sequelize Store
const SequelizeSessionStore = SequelizeStore(session.Store);
const sessionStore = new SequelizeSessionStore({
  db: sequelize,
  tableName: 'sessions',
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    proxy: true, // Required for Heroku & Digital Ocean (regarding X-Forwarded-For)
  })
);

// ` Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ` Configure Middleware For JSON format
app.use(express.json({ limit: '10mb' }));

// ` Configure Middleware For URL Encoded format



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
