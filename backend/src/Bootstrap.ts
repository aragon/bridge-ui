import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
const readline = require('readline');
const fetch = require("node-fetch");

import Configuration from "./config/Configuration";
import Provider from "./provider/Provider";
import Wallet from "./wallet/Wallet";

import Database from "./db/Database";
import Whitelist, { ListItem } from "./db/Whitelist";
import Admin from "./db/Admin";


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

        // rl.prompt();
        // rl.on('line', () => {

        //   rl.prompt();
        // }).on('close', () => {
        //   console.log('Have a great day!');
        //   process.exit(0);
        // });
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
    this.server.post(
      "/proposal",
      async (request: FastifyRequest, reply: FastifyReply) => {
        console.log("PROPOSAL>>>>>>>POST")
        console.log(request.body)

        const HUB_URL = "https://testnet.snapshot.page"
        const url = `${HUB_URL}/api/message`;

        const version = "0.1.3";
        const type = "proposal";
        const snapshot = 4405727;
        const payload = {
          name: "b2",
          body: "b2",
          choices: ["upvote", "downvote"],
          start: 1615071600,
          end: 1615417200,
          snapshot: snapshot,
          metadata: {
            strategies: [
              {
                name: "erc20-balance-of",
                params: {
                  address: "0xa117000000f279D81A1D3cc75430fAA017FA5A2e",
                  symbol: "ANT",
                  decimals: 18,
                },
              },
              {
                name: "balancer",
                params: {
                  address: "0xa117000000f279D81A1D3cc75430fAA017FA5A2e",
                  symbol: "ANT BPT",
                },
              },
            ],
          },
        };
        const envelope: any = {
          sig: "0x0123456789acbcdef",
          address: "0x8367dc645e31321CeF3EeD91a10a5b7077e21f70",
          msg: JSON.stringify({
            version: version,
            timestamp: "1615220902",
            space: "aragon",
            type: type,
            payload,
          }),
        };

        console.log(envelope)
        const init = {
          method: "POST",
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(envelope),
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
