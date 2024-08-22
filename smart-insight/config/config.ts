import "dotenv/config";

export const appConfig = {
  port: process.env.PORT,
  apiVersion: 1,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
};
