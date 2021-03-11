import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
const fetch = require("node-fetch");

import Configuration from "./config/Configuration";
import Database from "./db/Database";

export default class Bootstrap {
  /**
   * @property {FastifyInstance} server
   *
   * @private
   */
  private server: FastifyInstance;

  /**
   * @property {string} apiUrl
   *
   * @private
   */
  private apiUrl: string = "https://testnet.snapshot.page/api/message";

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
   * Register test routes.
   *
   * These routes are used to test things during development.
   *
   * @method registerTestRoute
   *
   * @returns {void}
   *
   * @private
   */
  private registerSimpleRoute() {
    this.server.get(
      "/simple/:space",
      async (request: FastifyRequest, reply: FastifyReply) => {
        const space = request.url.split("/").pop() || "";

        reply
          .code(200)
          .header("Access-Control-Allow-Origin", "*")
          .header("Content-Type", "application/json; charset=utf-8");
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
   * Upon receiving a request this method forwards the proposal to Snapshot. Snapshot
   * acknowledges the proposal by sending back a hash. his hash is then stored in the
   * database with the corresponding space name.
   *
   * @method registerProposalRoute
   *
   * @returns {void}
   *
   * @private
   */
  private registerProposalRoute() {
    this.server.post<{ Body: ProposalMessage }>(
      "/problemProposal/:space",
      async (request: FastifyRequest, reply: FastifyReply) => {
        const space = request.url.split("/").pop() || "";
        const init = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: request.body,
        };

        fetch(this.apiUrl, init)
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
              await this.db.addProblemProposal<String>(space, hash);
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
    this.server.post<{ Body: ProposalMessage }>(
      "/solutionProposal/:space/:problem",
      async (request: FastifyRequest, reply: FastifyReply) => {
        const urlParameters = request.url.split("/");
        const problem = urlParameters.pop() || "";
        const space = urlParameters.pop() || "";
        const init = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: request.body,
        };

        fetch(this.apiUrl, init)
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
              await this.db.addSolutionProposal<String>(space, problem, hash);
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
    this.server.get(
      "/problems/:space",
      async (request: FastifyRequest, reply: FastifyReply) => {
        const space = request.url.split("/").pop() || "";
        const init = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: request.body,
        };
        const problemIds = await this.db.getProblemIds(space);
        console.log("this is the reult: ");
        const problemSet = new Set();
        problemIds.forEach((pID) => problemSet.add(pID.problemhash));

        //pull proposals from Snapshot.
        fetch(`https://testnet.snapshot.page/api/${space}/proposals`)
          .then((res: Response) => {
            if (res.ok) {
              return res.json();
            } else {
              throw Error(res.statusText);
            }
          })
          .then((data: any) => Object.values(data))
          .then((proposals: Proposal[]) => {
            const filteredProposals = proposals.filter((p) =>
              problemSet.has(p.authorIpfsHash)
            );
            console.log(filteredProposals);

            reply
            .code(200)
            .header("Access-Control-Allow-Origin", "*")
            .header("Content-Type", "application/json; charset=utf-8")
            .send(filteredProposals);
          })
          .catch((error: Error) => {
            //TODO catch errors.
          });
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
   * @method setDatabase
   *
   * @returns {void}
   *
   * @private
   */
  private setDatabase(): void {
    this.db = new Database(this.config.database);
  }
}

// TYPES =================================================================================

// This is a proposal as formatted by the frontend. Snapshot expects a proposal to be
// posted in this form.
export interface ProposalMessage {
  sig: string;
  address: string;
  msg: Msg;
}

// This is Snapshot's response to a successfully posted proposal.
export interface ProposalResponse {
  ipfsHash: string;
}

//This is a proposal as stored on Snapshot.
export interface Proposal {
  address: string;
  msg: Msg;
  sig: string;
  authorIpfsHash: string;
  relayerIpfsHash: string;
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
