import { DataTypes } from 'sequelize';
import sequelize from '../DB/sequelize.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    profileImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: 'https://cdn-icons-png.flaticon.com/512/219/219983.png',
    },
    mobileNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    facebook: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    linkedin: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    instagram: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    whatsapp: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    savedPosts: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true, // Allow null for social logins
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
    googleId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    facebookId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    linkedinId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    provider: {
      type: DataTypes.ENUM('local', 'google', 'facebook', 'linkedin'),
      defaultValue: 'local',
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
    tableName: 'users',
    timestamps: true,
    indexes: [{ fields: ['username'] }, { fields: ['email'] }],
  }
);

export default User;
