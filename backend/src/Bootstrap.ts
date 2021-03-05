import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

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
        console.log("GET>>>>>>>sdfsdfsd")
        reply
        .code(200)
        // .header('Content-Type', 'application/json; charset=utf-8')
        .header('Access-Control-Allow-Origin', '*')
        .send({ hello: 'world' })
      }
    );

    this.server.post(
      "/simple",
      (request: FastifyRequest, reply: FastifyReply) => {
        console.log("POST>>>>>>>sdfsdfsd")
        reply
          .code(200)
          .header('Content-Type', 'application/json; charset=utf-8')
          .header('Access-Control-Allow-Origin', '*')
          .send({ requestBOdy: request.body })
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
