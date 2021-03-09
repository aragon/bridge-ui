import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
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
  private database: Database;

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
    this.registerProposlRoute();
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
      (request: FastifyRequest, reply: FastifyReply) => {
        console.log("SIMPLE>>>>>>>GET")
        reply
        .code(200)
        .header('Access-Control-Allow-Origin', '*')
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ hello: 'world' })
      }
    );

    this.server.post(
      "/simple",
      (request: FastifyRequest, reply: FastifyReply) => {
        console.log("SIMPLE>>>>>>>POST")
        reply
          .code(200)
          .header('Content-Type', 'application/json; charset=utf-8')
          .header('Access-Control-Allow-Origin', '*')
          .send({ requestBOdy: request.body })
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
  private registerProposlRoute() {
    this.server.post <{ Body: ProposalMessage }>(
      "/proposal",
      async (request: FastifyRequest, reply: FastifyReply) => {
        console.log("PROPOSAL>>>>>>>POST")

        const HUB_URL = "https://testnet.snapshot.page"
        const url = `${HUB_URL}/api/message`;

        const init = {
          method: "POST",
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: request.body,
        };
    
        fetch(url, init).then((res: Response) => {
          if (res.ok) {
            console.log("yay from backend")
            console.log(res.body)
          } else {
            console.log("nay from backend")
            console.log(res.statusText)
            res.text().then(console.log)
          }
        }).then(
          reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .header('Access-Control-Allow-Origin', '*')
            .send({ requestBody: request.body })
        )
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
    this.database = new Database(this.config.database);
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
    this.provider = new Provider(
      this.config.ethereum,
      new Wallet(this.database)
    );
  }
}

// TYPES =================================================================================

export interface ProposalMessage {
  sig:     string;
  address: string;
  msg:     Msg;
}

export interface Msg {
  version:   string;
  timestamp: string;
  space:     string;
  type:      string;
  payload:   Payload;
}

export interface Payload {
  name:     string;
  body:     string;
  choices:  string[];
  start:    number;
  end:      number;
  snapshot: number;
  metadata: Metadata;
}

export interface Metadata {
  strategies: Strategy[];
}

export interface Strategy {
  name:   string;
  params: Params;
}

export interface Params {
  address:   string;
  symbol:    string;
  decimals?: number;
}