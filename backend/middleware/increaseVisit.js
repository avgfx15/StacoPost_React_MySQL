import { Post } from '../models/associations.js';

const increaseVisit = async (req, res, next) => {
  const slug = req.params.slug;
  await Post.increment('visitorsNo', { where: { slug } });
  next();
};

export default increaseVisit;
