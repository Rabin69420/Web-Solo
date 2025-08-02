import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  "rent",
  "postgres",
  "33533",
  {
    host: "localhost",
    dialect: 'postgres',
    logging: false
  }
);

export default sequelize;
