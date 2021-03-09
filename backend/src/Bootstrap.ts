import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
const fetch = require("node-fetch");

import Configuration from "./config/Configuration";
import Provider from "./provider/Provider";
import Wallet from "./wallet/Wallet";

import Database from "./db/Database";
import Whitelist, { ListItem } from "./db/Whitelist";
import Admin from "./db/Admin";

export default class Bootstrap {
  /**
   * @property {FastifyInstance} server
   *
   * @private
   */
  private server: FastifyInstance;

  /**
   * @property {Whitelist} whitelist
   *
   * @private
   */
  private whitelist: Whitelist;

  /**
   * @property {Provider} provider
   *
   * @private
   */
  private provider: Provider;

  /**
   * @property {Database} database
   *
   * @private
   */
  private db: Database;

  /**
   * @param {Configuration} config
   *
   * @constructor
   */
  constructor(private config: Configuration) {
    this.setServer();
    this.setDatabase();
    this.setProvider();
    this.registerSimpleRoute();
    this.registerProposalRoute();
  }

  /**
   * Starts the entire server
   *
   * @method run
   *
   * @returns {void}
   *
   * @public
   */
  public run(): void {
    this.server.listen(
      this.config.server.port,
      this.config.server.host,
      (error: Error, address: string): void => {
        if (error) {
          console.error(error);
          process.exit(0);
        }

        console.log(`Server is listening at ${address}`);
      }
    );
  }

  /**
   * Register test routes
   *
   * @method registerTestRoute
   *
   * @returns {void}
   *
   * @private
   */
  private registerSimpleRoute() {
    this.server.get(
      "/simple",
      async (request: FastifyRequest, reply: FastifyReply) => {
        reply
          .code(200)
          .header("Access-Control-Allow-Origin", "*")
          .header("Content-Type", "application/json; charset=utf-8")
          .send({ hello: "world" });
      }
    );
    this.server.post(
      "/simple",
      async (request: FastifyRequest, reply: FastifyReply) => {
        reply
          .code(200)
          .header("Content-Type", "application/json; charset=utf-8")
          .header("Access-Control-Allow-Origin", "*")
          .send({ requestBOdy: request.body });
      }
    );
  }

  /**
   * Register route for new proposal
   *
   * @method registerTestRoute
   *
   * @returns {void}
   *
   * @private
   */
  private registerProposalRoute() {
    this.server.post<{ Body: ProposalMessage }>(
      "/proposal",
      async (request: FastifyRequest, reply: FastifyReply) => {
        const HUB_URL = "https://testnet.snapshot.page";
        const url = `${HUB_URL}/api/message`;
        const init = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: request.body,
        };

        fetch(url, init)
          .then((res: Response) => {
            if (res.ok) {
              return res.json();
            } else {
              throw Error(res.statusText);
            }
          })
          .then(async (data: ProposalResponse) => {
            try {
              const hash = data.ipfsHash;
              await this.db.addProblemProposal<String>(hash);
            } catch (error) {
              console.error(error);
              reply
                .code(200)
                .header("Access-Control-Allow-Origin", "*")
                .header("Content-Type", "application/json; charset=utf-8")
                .send(error);
            }

            reply
              .code(200)
              .header("Content-Type", "application/json; charset=utf-8")
              .header("Access-Control-Allow-Origin", "*");
          })
          .catch((error: Error) =>
            reply
              .code(500)
              .header("Content-Type", "application/json; charset=utf-8")
              .header("Access-Control-Allow-Origin", "*")
              .send(error)
          );
      }
    );
  }

  /**
   * Initiates the server instance
   *
   * @method setServer
   *
   * @returns {void}
   *
   * @private
   */
  private setServer(): void {
    this.server = fastify({
      logger: {
        level: this.config.server.logLevel ?? "debug",
      },
    });
  }

  /**
   * Initiates the database instance
   *
   * @method setProvider
   *
   * @returns {void}
   *
   * @private
   */
  private setDatabase(): void {
    this.db = new Database(this.config.database);
  }

  /**
   * Initiates the provider instance
   *
   * @method setProvider
   *
   * @returns {void}
   *
   * @private
   */
  private setProvider(): void {
    this.provider = new Provider(this.config.ethereum, new Wallet(this.db));
  }
}

// TYPES =================================================================================

export interface ProposalResponse {
  ipfsHash: string;
}

export interface ProposalMessage {
  sig: string;
  address: string;
  msg: Msg;
}

export interface Msg {
  version: string;
  timestamp: string;
  space: string;
  type: string;
  payload: Payload;
}

export interface Payload {
  name: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: number;
  metadata: Metadata;
}

export interface Metadata {
  strategies: Strategy[];
}

export interface Strategy {
  name: string;
  params: Params;
}

export interface Params {
  address: string;
  symbol: string;
  decimals?: number;
}
