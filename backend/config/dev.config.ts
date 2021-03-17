import { Config } from "../src/config/Configuration";

export const config: Config = {
  ethereum: {
    publicKey: "", // Add default EOA
    contracts: {
      GovernQueue: "", // Add deployment address can get calculated if deployed with create2
      GovernBaseFactory: "",
    },
    url: "http://localhost:8545",
    blockConfirmations: 42,
  },
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
