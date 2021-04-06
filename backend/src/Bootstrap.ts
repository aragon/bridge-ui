import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { IpfsProposal, TaggedProposal } from "../lib/Types";
const fetch = require("node-fetch");
import Configuration from "./config/Configuration";
import Database, { Output } from "./db/Database";

export default class Bootstrap {
  /**
   * @property {FastifyInstance} server
   * @private
   */
  private server: FastifyInstance;

  // private SNAPSHOT_URL = "https://hub.snapshot.org/api"
  private SNAPSHOT_URL = "https://testnet.snapshot.org/api";

  private IPFS_URL = "https://ipfs.fleek.co/ipfs";

  /**
   * @property {string} apiUrl
   * @private
   */
  private POST_URL: string = `${this.SNAPSHOT_URL}/message`;

  /**
   * @property {Database} database
   * @private
   */
  private db: Database;

  /**
   * @param {Configuration} config
   * @constructor
   */
  constructor(private config: Configuration) {
    this.setServer();
    this.setDatabase();
    this.registerSimpleRoute();
    this.registerTestRoute();
    this.registerRoutes();
  }

  /**
   * Starts the entire server
   *
   * @method run
   * @returns {void}
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
   * @returns {void}
   * @private
   */
  private registerTestRoute() {
    this.server.get("/t", (_, reply) => {
      reply
        .code(200)
        .header("Access-Control-Allow-Origin", "*")
        .header("Content-Type", "application/json; charset=utf-8")
        .send({ greetings: "Hey there! You've reached the server." });
    });
  }

  /**
   * Register test routes.
   *
   * These routes are used to test things during development.
   *
   * @method registerTestRoute
   * @returns {void}
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
   * TODO: Move entire logic out to Action classes extending from AbstractAction.
   * TODO: In the end only `new XAction(..).execute()` should be called here. This is the minimum OOD I did for govern-tx.
   *
   * Register route for new proposal
   *
   * Upon receiving a request this method forwards the proposal to Snapshot. Snapshot
   * acknowledges the proposal by sending back a hash. his hash is then stored in the
   * database with the corresponding space name.
   *
   * @method registerRoutes
   *
   * @returns {void}
   *
   * @private
   */
  private registerRoutes() {
    this.server.post<{ Body: ProposalMessage }>(
      "/problemProposal/:space",
      async (request: FastifyRequest, reply: FastifyReply) => {
        const { space } = request.params as { space: string };

        // Separate snapshot payload from tags
        const entireBodyString = (request.body as string) || "";
        const entireBody = JSON.parse(entireBodyString);
        const tags: string[] = entireBody.tags;
        const body: BodyInit | null | undefined = JSON.stringify(
          entireBody.snapshot
        );

        const init: RequestInit = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: body,
        };

        // make it asyn/await
        const _request = async () => {
          try {
            const response = await fetch(this.POST_URL, init);
            const data: ProposalResponse = await response.json();
            
            try {
              const hash = data.ipfsHash;
              await this.db.addProblemProposal<String>(space, hash, tags);
              reply
              .code(200)
              .header("Content-Type", "application/json; charset=utf-8")
              .header("Access-Control-Allow-Origin", "*")
              .send()
            } catch (error) {
              console.error(error);
              reply
                .code(500)
                .header("Access-Control-Allow-Origin", "*")
                .header("Content-Type", "application/json; charset=utf-8")
                .send(error);
            }

          } catch (error) {
            throw Error('_request failed: ' +  error);
          }
        }
        
        _request();
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

        // make it asyn/await
        const _request = async () => {
          try {
            const response = await fetch(this.POST_URL, init);
            const data: ProposalResponse = await response.json();
            
            try {
              const hash = data.ipfsHash;
              await this.db.addSolutionProposal<String>(space, problem, hash);
              reply
              .code(200)
              .header("Content-Type", "application/json; charset=utf-8")
              .header("Access-Control-Allow-Origin", "*")
              .send()
            } catch (error) {
              console.error(error);
              reply
                .code(500)
                .header("Access-Control-Allow-Origin", "*")
                .header("Content-Type", "application/json; charset=utf-8")
                .send(error);
            }

          } catch (error) {
            throw Error('_request failed: ' +  error);
          }
        }
        
        _request();
      }
    );
    this.server.get(
      "/problems/:space",
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          const { space } = request.params as { space: string };

          //query DB for problems created on apollo.
          const res: Output[] = await this.db.getProblemIds(space);

          //pull problems from ipfs.
          const problem_promises: Promise<IpfsProposal>[] = res.map((o) => {
            return fetch(`${this.IPFS_URL}/${o.problemhash}`)
              .then((res: any) => res.json())
              .then((data: IpfsProposal) => {
                return data;
              });
          });
          const problems: IpfsProposal[] = await Promise.all(problem_promises);

          // properly type problems, adding the tags and ipfs hash.
          const taggedProblems: TaggedProposal[] = problems.map((p, i) => {
            const q: TaggedProposal = {
              address: p.address,
              msg: JSON.parse(p.msg),
              sig: p.sig,
              version: p.version,
              tags: res[i].tags,
              hash: res[i].problemhash,
            };
            return q;
          });

          reply
            .code(200)
            .header("Access-Control-Allow-Origin", "*")
            .header("Content-Type", "application/json; charset=utf-8")
            .send(taggedProblems);
        } catch (error) {
          reply
            .code(500)
            .header("Access-Control-Allow-Origin", "*")
            .header("Content-Type", "application/json; charset=utf-8")
            .send(error);
        }
      }
    );
    this.server.get(
      "/solutions/:space/:problem",
      async (request: FastifyRequest, reply: FastifyReply) => {
        const urlParameters = request.url.split("/");
        const problem = urlParameters.pop() || "";
        const space = urlParameters.pop() || "";

        //query DB for problems created on apollo.
        const solutionIds = await this.db.getSolutionIds(space, problem);
        const solutionSet = new Set();
        solutionIds.forEach((pID) => solutionSet.add(pID.solutionhash));

        //pull proposals from Snapshot.
        fetch(`${this.SNAPSHOT_URL}/${space}/proposals`)
          .then((res: Response) => {
            if (res.ok) {
              return res.json();
            } else {
              throw Error(res.statusText);
            }
          })
          .then((data: any) => Object.values(data))
          .then((proposals: Proposal[]) => {
            //filter out the ones not created on apollo
            const filteredProposals = proposals.filter((p) =>
              solutionSet.has(p.authorIpfsHash)
            );

            reply
              .code(200)
              .header("Access-Control-Allow-Origin", "*")
              .header("Content-Type", "application/json; charset=utf-8")
              .send(filteredProposals);
          })
          .catch((error: Error) => {
            reply
              .code(500)
              .header("Access-Control-Allow-Origin", "*")
              .header("Content-Type", "application/json; charset=utf-8")
              .send(error);
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
