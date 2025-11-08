// | import express
import express from 'express';

// ` Configure CategoryRouter
const categoryRouter = express.Router();

// | import Controller
import {
  getAllCategoriesController,
  createCategoryController,
  deleteCategoryController,
} from '../controllers/categoryControllers.js';
import { authenticateToken } from '../controllers/authController.js';

// ` Configure Routes
// & Test Route
categoryRouter.get('/test', (req, res) =>
  res.status(200).send('categoryRouter Test!')
);

// / Get All Categories Route
categoryRouter.get('/', getAllCategoriesController);

// + Create Category
categoryRouter.post('/', authenticateToken, createCategoryController);

// - Delete Category By Id
categoryRouter.delete(
  '/:categoryId',
  authenticateToken,
  deleteCategoryController
);

// ~ Export categoryRouter
export default categoryRouter;
