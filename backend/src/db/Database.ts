import postgres = require("postgres");
import { DatabaseOptions } from "../config/Configuration";

export interface Output {
  problemhash: string;
  tags: string[];
}

export default class Database {
  /**
   * The sql function of the postgres client
   *
   * @property {Function} sql
   * @private
   */
  private sql: any;

  /**
   * @param {DatabaseOptions} config - The database configuration
   * @constructor
   */
  constructor(private config: DatabaseOptions) {
    this.connect();
  }

  /**
   * Establishes the connection to the postgres DB
   *
   * @method connect
   * @returns {void}
   * @private
   */
  private connect(): void {
    this.sql = postgres({
      host: this.config.host,
      port: this.config.port,
      database: this.config.database,
      username: this.config.user,
      password: this.config.password,
    });
  }

  /**
   * Executes a query on the DB
   *
   * @method query
   * @param {string} query - The SQL statement
   * @returns {Promise<any>}
   * @public
   */
  public query<T>(query: string): Promise<T> {
    // NOTE: remove this query function from the code base.
    // Reasoning: Function call is wrong. Postgres package expects tagged function:
    // this.sql`<some sql statement>`. Also, statements must be written out here and may
    // not be passed as arguments.
    // Temporarily kept due to dependencies.
    return this.sql(query);
  }

  /**
   * Inserts a problem proposal for a certian space into the DB. Note that empty list of
   * tags will be inserted as null, not as an empty string.
   *
   * @method addProblemProposal
   * @param {string} space - Name of space for which proposal is posted
   * @param {string} proposalHash - Hash that identifies the proposal on Snapshot
   * @param {string[]} tags - List of tags associated to problem
   * @returns {Promise<string>}
   * @public
   */
  public addProblemProposal<T>(
    space: string,
    proposalHash: string,
    tags: string[]
  ): Promise<string> {
    if (tags.length == 0) {
      return this.sql`
      INSERT INTO reference (spaceName, problemHash, solutionHash, tags)
      VALUES (${space}, ${proposalHash}, null, null);
      `;
    } else {
      return this.sql`
        INSERT INTO reference (spaceName, problemHash, solutionHash, tags)
        VALUES (${space}, ${proposalHash}, null, ${this.sql.array(tags)});
        `;
    }
  }

  /**
   * Inserts a solution-proposal for a certian space and problem into the DB.
   *
   * @method addSolutionProposal
   * @param {string} space - Name of space for which proposal is posted
   * @param {string} proposalHash - Hash of the corresponding problem
   * @param {string} solutionHash - Hash that identifies the proposal on Snapshot
   * @returns {Promise<any>}
   * @public
   */
  public addSolutionProposal<T>(
    space: string,
    proposalHash: string,
    solutionHash: string
  ): Promise<T> {
    return this.sql`
      INSERT INTO reference (spaceName, problemHash, solutionHash, tags)
      VALUES (${space}, ${proposalHash}, ${solutionHash}, null);
      `;
  }

  /**
   * Returns all hashes of problems posted on apollo for a given space. Each hash is
   * accompanied by a list of tags that belong to that problem.
   *
   * @method getProblemIds
   * @param {string} space - Name of space for which proposal is posted
   * @returns {Promise<Output[]>}
   * @public
   */
  public getProblemIds(space: string): Promise<Output[]> {
    return this.sql<Output[]>`
      SELECT DISTINCT problemhash, tags FROM reference
      WHERE solutionHash IS NULL AND spacename=${space};
      `;
  }

  /**
   * Returns all hashes of solutions posted on apollo for a given space and problem.
   *
   * @method getProblemIds
   * @param {string} space - Name of space for which proposal is posted
   * @param {string} problem - Hash of the corresponding problem
   * @returns {{ problemhash: string }[]}
   * @public
   */
  public getSolutionIds(
    space: string,
    problem: string
  ): Promise<{ solutionhash: string }[]> {
    return this.sql<{ solutionhash: string }[]>`
      SELECT DISTINCT solutionhash FROM reference
      WHERE problemhash=${problem} AND NOT solutionHash IS NULL AND spacename=${space};
      `;
  }
}
