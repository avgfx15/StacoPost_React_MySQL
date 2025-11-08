import { DataTypes } from 'sequelize';
import sequelize from '../DB/sequelize.js';

const Like = sequelize.define(
  'Like',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    likeUser_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    likePost_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    likeComment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('like', 'dislike'),
      allowNull: false,
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
    tableName: 'likes',
    timestamps: true,
    indexes: [
      { fields: ['likeUser_id'] },
      { fields: ['likePost_id'] },
      { fields: ['likeComment_id'] },
      { fields: ['type'] },
      { fields: ['createdAt'] },
      // Unique index to ensure one like/dislike per user per post or comment
      {
        unique: true,
        fields: ['likeUser_id', 'likePost_id'],
        where: {
          likePost_id: {
            [sequelize.Sequelize.Op.ne]: null,
          },
        },
      },
      {
        unique: true,
        fields: ['likeUser_id', 'likeComment_id'],
        where: {
          likeComment_id: {
            [sequelize.Sequelize.Op.ne]: null,
          },
        },
      },
    ],
  }
);

export default Like;
