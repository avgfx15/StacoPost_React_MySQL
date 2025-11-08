import { DataTypes } from 'sequelize';
import sequelize from '../DB/sequelize.js';

const Post = sequelize.define(
  'Post',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    postTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    subTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    visitorsNo: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'posts',
    timestamps: true,
    indexes: [
      { fields: ['slug'] },
      { fields: ['author_id'] },
      { fields: ['category_id'] },
      { fields: ['isFeatured'] },
      { fields: ['visitorsNo'] },
      { fields: ['createdAt'] },
    ],
  }
);

export default Post;
