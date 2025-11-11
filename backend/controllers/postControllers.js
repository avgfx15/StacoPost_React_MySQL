// | Import POST MODEL
import { Post, User, Category } from '../models/associations.js';
import Sequelize, { Op } from 'sequelize';

// | Import Slugify
import slugify from 'slugify';

// | Import striptags
import striptags from 'striptags';

// | Import ImageKit
import ImageKit from 'imagekit';

// | Import dotenv Module
import dotenv from 'dotenv';
dotenv.config({ override: true });

// / Upload Auth Using ImageKit

let imageKit = null;
try {
  if (
    process.env.IMAGEKIT_PRIVATE_KEY &&
    process.env.IMAGEKIT_PUBLIC_KEY &&
    process.env.IMAGEKIT_END_POINT
  ) {
    imageKit = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: process.env.IMAGEKIT_END_POINT,
    });
  }
} catch (error) {
  console.warn('ImageKit not configured:', error.message);
}

export const uploadAuthController = async (req, res) => {
  try {
    if (!imageKit) {
      return res.status(500).json({ error: 'ImageKit not configured' });
    }
    const result = imageKit.getAuthenticationParameters();

    res.status(200).json(result);
  } catch (error) {
    console.error('Error generating authentication parameters:', error);
    res
      .status(500)
      .send({ error: 'Failed to generate authentication parameters' });
  }
};

// / Get All Posts
export const getAllPostController = async (req, res) => {
  const page = Number.parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = Number.parseInt(req.query.limit) || 5;

  const query = {};

  // Check if user is admin to show all posts, else only active posts
  const user = req.user;
  const includeInactive = req.query.includeInactive === 'true';
  if (!user || user.role !== 'admin') {
    query.isActive = true;
  } else if (!includeInactive) {
    // Admin sees only active posts by default unless includeInactive is true
    query.isActive = false;
  }
  // If admin and includeInactive is true, no isActive filter is applied

  const category = req.query.category;
  const author = req.query.author;
  const searchInput = req.query.searchInput;
  const featuredPost = req.query.featuredPost;
  const sortQuery = req.query.sort;

  if (category) {
    const categoryDoc = await Category.findOne({ where: { slug: category } });
    if (categoryDoc) {
      query.category_id = categoryDoc.id;
    }
  }
  if (author) {
    const authorDoc = await User.findAll({
      where: {
        [Op.or]: [
          Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('username')),
            'LIKE',
            `%${author.toLowerCase()}%`
          ),
          Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('email')),
            'LIKE',
            `%${author.toLowerCase()}%`
          ),
        ],
      },
    });

    if (authorDoc && authorDoc.length > 0) {
      query.author_id = authorDoc[0].id;
    }
  }
  if (searchInput) {
    query.postTitle = Sequelize.where(
      Sequelize.fn('LOWER', Sequelize.col('postTitle')),
      'LIKE',
      `%${searchInput.toLowerCase()}%`
    );
  }
  if (featuredPost) {
    query.isFeatured = true;
  }

  let order = [['createdAt', 'DESC']];

  if (sortQuery) {
    switch (sortQuery) {
      case 'newest':
        order = [['createdAt', 'DESC']];
        break;
      case 'oldest':
        order = [['createdAt', 'ASC']];
        break;
      case 'mostpopular':
        order = [['visitorsNo', 'DESC']];
        break;
      case 'trending':
        order = [['visitorsNo', 'DESC']];
        query.createdAt = {
          [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)),
        };
        break;
      default:
        break;
    }
  }

  const allPost = await Post.findAll({
    where: query,
    include: [
      {
        model: User,
        as: 'author',
        attributes: [
          'username',
          'email',
          'profileImage',
          'facebook',
          'linkedin',
          'instagram',
          'whatsapp',
        ],
      },
      { model: Category, as: 'category', attributes: ['name', 'slug'] },
    ],
    order,
    limit,
    offset: (page - 1) * limit,
  });

  const totalPosts = await Post.count({ where: query });
  const hasMore = page * limit < totalPosts;
  const totalPages = Math.ceil(totalPosts / limit);
  res.status(200).json({
    allPost,
    nextCursor: hasMore ? page + 1 : null,
    totalPages,
    totalPosts,
    hasMore,
  });
};

// / Get Single Post By Slug
export const getSinglePostBySlugController = async (req, res) => {
  const slug = req.params.slug;

  const query = { slug };

  // Check if user is admin to show inactive posts, else only active posts
  const user = req.user;
  if (!user || user.role !== 'admin') {
    query.isActive = true;
  }

  const getPostBySlug = await Post.findOne({
    where: query,
    include: [
      {
        model: User,
        as: 'author',
        attributes: [
          'username',
          'email',
          'profileImage',
          'facebook',
          'linkedin',
          'instagram',
          'whatsapp',
        ],
      },
      { model: Category, as: 'category', attributes: ['name', 'slug'] },
    ],
  });
  res.status(200).json(getPostBySlug);
};

// + Create New Posts

export const createPostController = async (req, res) => {
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

  // $ De-structure input from client
  const { category, postImage, postTitle, subTitle, content } = req.body;

  // ` Create SLUG

  let slugTitle = striptags(postTitle)
    .replaceAll(/\([^)]*\)/g, '')
    .trim();

  let slug = slugify(slugTitle, {
    replacement: '_', // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: false, // strip special characters except replacement, defaults to `false`
    locale: 'vi', // language code of the locale to use
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
  });

  let checkSlugExist = await Post.findOne({ where: { slug } });

  let counter = 2;
  while (checkSlugExist) {
    slug = `${slugify(slugTitle, {
      replacement: '_',
      remove: undefined,
      lower: true,
      strict: false,
      locale: 'vi',
      trim: true,
    })}-${counter}`;
    checkSlugExist = await Post.findOne({ where: { slug } });
    counter++;
  }
  // ! End of unique slug code

  // % Check if all fields are provided
  if (!category || !postTitle || !subTitle || !content) {
    console.log('Missing fields:', { category, postTitle, subTitle, content });
    return res.status(400).json({ message: 'All fields are required' });
  }

  // % Handle category: check if exists, create if not
  let categoryDoc;
  const existingCategory = await Category.findOne({
    where: {
      [Op.or]: [
        { name: category.toLowerCase() },
        {
          slug: slugify(category, {
            replacement: '_',
            remove: undefined,
            lower: true,
            strict: false,
            locale: 'vi',
            trim: true,
          }),
        },
      ],
    },
  });

  if (existingCategory) {
    categoryDoc = existingCategory;
  } else {
    // Create new category
    const categorySlug = slugify(category, {
      replacement: '_',
      remove: undefined,
      lower: true,
      strict: false,
      locale: 'vi',
      trim: true,
    });

    categoryDoc = await Category.create({
      name: category.trim(),
      slug: categorySlug,
    });
  }

  // % Check if postTitle is less than 50 characters
  // if (postTitle.length > 50) {
  //   return res
  //     .status(400)
  //     .json({ message: 'Post Title should be less than 50 characters' });
  // }

  // @ Declare new Post Data
  const newPost = {
    author_id: userExist.id,
    category_id: categoryDoc.id,
    postImage,
    postTitle,
    slug,
    subTitle,
    content,
    isActive: false, // New posts are inactive by default
  };

  // # Save Post
  const savedPost = await Post.create(newPost);
  res.status(201).json(savedPost);
};

// - Delete Post By Id

export const deletePostController = async (req, res) => {
  // % Get PostId from params
  const postId = req.params.postId;

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

  // $ Check if User is Admin or the author
  if (userExist.role !== 'admin' && userExist.id !== findPost.author_id) {
    return res.status(403).json('You are not authorized to delete this post.');
  }

  const findPost = await Post.findByPk(postId);

  if (!findPost) {
    return res.status(404).json('Post not found.');
  }

  await findPost.destroy();
  res.status(200).json('Post Deleted Successfully!');
};

// + Feature Post By Id
export const featurePostController = async (req, res) => {
  // % Get PostId from params
  const postId = req.body.postId;

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

  // $ Check if User is Admin
  if (userExist.role !== 'admin') {
    return res.status(403).json('You are not authorized to feature this post.');
  }

  const findPost = await Post.findByPk(postId);

  if (!findPost) {
    return res.status(404).json('Post not found.');
  }

  // % Check post isFeatured or not
  const isFeatured = findPost.isFeatured;

  // % Toggle isFeatured status
  await findPost.update({ isFeatured: !isFeatured });

  // Logic to feature the post
  res.status(200).send(findPost);
};

// + Activate/Deactivate Post By Id (Admin Only)
export const activatePostController = async (req, res) => {
  // % Get PostId from params
  const postId = req.body.postId;

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

  // $ Check if User is Admin
  if (userExist.role !== 'admin') {
    return res
      .status(403)
      .json('You are not authorized to activate/deactivate this post.');
  }

  const findPost = await Post.findByPk(postId);

  if (!findPost) {
    return res.status(404).json('Post not found.');
  }

  // % Check post isActive or not
  const isActive = findPost.isActive;

  // % Toggle isActive status
  await findPost.update({ isActive: !isActive });

  // Logic to activate/deactivate the post
  res.status(200).json({
    message: `Post ${!isActive ? 'activated' : 'deactivated'} successfully.`,
    post: findPost,
  });
};
