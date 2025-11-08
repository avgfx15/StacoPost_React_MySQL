import { DataTypes } from 'sequelize';
import sequelize from '../DB/sequelize.js';

const Category = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
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
    tableName: 'categories',
    timestamps: true,
    indexes: [
      { fields: ['name'] },
      { fields: ['slug'] },
      { fields: ['createdAt'] },
    ],
  }
);

export default Category;
