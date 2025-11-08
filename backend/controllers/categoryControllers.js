// | Import Category MODEL
import { Category } from '../models/associations.js';
import { Op } from 'sequelize';

// | Import Slugify
import slugify from 'slugify';

// / Get All Categories
export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

// + Create New Category
export const createCategoryController = async (req, res) => {
  try {
    // Get user from JWT token
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'You are Unauthorized' });
    }

    // Find User from UserModel
    const { User } = await import('../models/associations.js');
    const userExist = await User.findByPk(user.id);

    if (!userExist) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // Create slug from name
    const slug = slugify(name, {
      replacement: '_',
      remove: undefined,
      lower: true,
      strict: false,
      locale: 'vi',
      trim: true,
    });

    // Check if category already exists
    const existingCategory = await Category.findOne({
      where: {
        [Op.or]: [{ name: name.toLowerCase() }, { slug }],
      },
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const newCategory = {
      name: name.trim(),
      slug,
    };

    const savedCategory = await Category.create(newCategory);
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Failed to create category' });
  }
};

// - Delete Category By Id
export const deleteCategoryController = async (req, res) => {
  try {
    // Get user from JWT token
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'You are Unauthorized' });
    }

    // Find User from UserModel
    const { User } = await import('../models/associations.js');
    const userExist = await User.findByPk(user.id);

    if (!userExist) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    // Check if user is admin
    if (userExist.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Only admins can delete categories' });
    }

    const { categoryId } = req.params;

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category is being used by any posts
    const { Post } = await import('../models/associations.js');
    const postsUsingCategory = await Post.findAll({
      where: { category_id: categoryId },
    });

    if (postsUsingCategory.length > 0) {
      return res.status(400).json({
        message: 'Cannot delete category as it is being used by posts',
      });
    }

    await Category.destroy({ where: { id: categoryId } });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Failed to delete category' });
  }
};
