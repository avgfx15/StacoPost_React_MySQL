import dotenv from 'dotenv';

dotenv.config({ override: true });

export default {
  development: {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: false,
  },
};
