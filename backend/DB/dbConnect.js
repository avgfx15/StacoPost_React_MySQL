import { Sequelize } from 'sequelize';
import sequelize from './sequelize.js';
import '../models/associations.js'; // Import associations to set them up

const requiredTables = ['users', 'posts', 'comments', 'categories'];

const dbConnect = async () => {
  const dbName = process.env.DB_DATABASE || 'stacopost';
  const dbPassword = process.env.DB_PASSWORD;
  if (!dbPassword) {
    throw new Error('DB_PASSWORD environment variable is required.');
  }

  try {
    // First, check if database exists by trying to authenticate
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.log(error);
    console.error(
      'Database does not exist or connection failed, creating database...'
    );
    try {
      // Create the database if it doesn't exist
      const tempSequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        username: process.env.DB_USER || 'root',
        password: dbPassword,
        database: 'mysql', // Connect to system database to create new one
        logging: false,
      });
      await tempSequelize.authenticate();
      await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
      await tempSequelize.close();
      console.log('Database created successfully.');
      // Now authenticate again with the database
      await sequelize.authenticate();
      console.log('Database connection established successfully.');
    } catch (createError) {
      console.error('Failed to create database:', createError.message);
      throw createError;
    }
  }

  try {
    // Check if all required tables exist
    const queryInterface = sequelize.getQueryInterface();
    const existingTables = await queryInterface.showAllTables();
    const missingTables = requiredTables.filter(
      (table) => !existingTables.includes(table)
    );

    if (missingTables.length > 0) {
      console.log(
        `Missing tables: ${missingTables.join(', ')}. Creating tables...`
      );
      // Sync all models to create missing tables
      await sequelize.sync(); // Creates tables if they don't exist, without altering existing ones
      console.log('All models were synchronized successfully.');
    } else {
      console.log('All required tables are available.');
    }
  } catch (syncError) {
    console.error('Failed to sync tables:', syncError.message);
    throw syncError;
  }
};

export default dbConnect;
