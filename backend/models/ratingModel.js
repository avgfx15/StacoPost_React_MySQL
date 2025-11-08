import { DataTypes } from 'sequelize';
import sequelize from '../DB/sequelize.js';

const Rating = sequelize.define(
  'Rating',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ratingUser_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ratingPost_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ratingComment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
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
    tableName: 'ratings',
    timestamps: true,
    indexes: [
      { fields: ['ratingUser_id'] },
      { fields: ['ratingPost_id'] },
      { fields: ['ratingComment_id'] },
      { fields: ['createdAt'] },
      // Unique index to ensure one rating per user per post or comment
      {
        unique: true,
        fields: ['ratingUser_id', 'ratingPost_id'],
        where: {
          ratingPost_id: {
            [sequelize.Sequelize.Op.ne]: null,
          },
        },
      },
      {
        unique: true,
        fields: ['ratingUser_id', 'ratingComment_id'],
        where: {
          ratingComment_id: {
            [sequelize.Sequelize.Op.ne]: null,
          },
        },
      },
    ],
  }
);

export default Rating;
