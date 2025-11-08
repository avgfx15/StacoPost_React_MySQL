import { DataTypes } from 'sequelize';
import sequelize from '../DB/sequelize.js';

const Comment = sequelize.define(
  'Comment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    commentUser_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    commentPost_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    commentDesc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    parentComment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
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
    tableName: 'comments',
    timestamps: true,
    indexes: [
      { fields: ['commentUser_id'] },
      { fields: ['commentPost_id'] },
      { fields: ['parentComment_id'] },
      { fields: ['createdAt'] },
    ],
  }
);

export default Comment;
