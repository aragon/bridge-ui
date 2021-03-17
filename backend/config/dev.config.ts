import { Config } from "../src/config/Configuration";

export const config: Config = {
  database: {
    user: "postgres",
    host: "postgres",
    password: "abcd123",
    database: "postgres",
    port: 5432,
  },
  server: {
    host: "0.0.0.0",
    port: 4040,
  },
};
