import { Config } from "../src/config/Configuration";
// require("dotenv").config();

export const config: Config = {
  database: {
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "postgres",
    password: process.env.DB_PW || "abcd123",
    database: process.env.DB_DB || "postgres",
    port: parseInt(process.env.DB_PORT || "5432"),
  },
  server: {
    host: process.env.SERVER_HOST || "0.0.0.0",
    port: parseInt(process.env.SERVER_PORT || "4040"),
  },
};
