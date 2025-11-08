import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const dbPassword = process.env.DB_PASSWORD;
if (!dbPassword) {
  throw new Error('DB_PASSWORD environment variable is required.');
}

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: false, // Set to console.log to see SQL queries
});

export default sequelize;
