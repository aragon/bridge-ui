import postgres = require("postgres");
import { DatabaseOptions } from "../config/Configuration";

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
    //FIXME remove this query function from the code base.
    // Reasoning: Function call is wrong. Postgres package expects tagged function:
    // this.sql`<some sql statement>`. Also, statements must be written out here and may
    // not be passed as arguments.
    // Temporarily kept due to dependencies.
    return this.sql(query);
  }

  /**
   * Inserts a problem-proposal for a certian space into the DB.
   *
   * @method addProblemProposal
   * @param {string} space - Name of space for which proposal is posted
   * @param {string} space - Hash that identifies the proposal on Snapshot
   * @returns {Promise<any>}
   * @public
   */
  public addProblemProposal<T>(
    space: string,
    proposalHash: string
  ): Promise<T> {
    return this.sql`
      INSERT INTO reference (spaceName, problemHash, solutionHash)
      VALUES (${space}, ${proposalHash}, null);
      `;
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
      INSERT INTO reference (spaceName, problemHash, solutionHash)
      VALUES (${space}, ${proposalHash}, ${solutionHash});
      `;
  }

  /**
   * Returns all hashes of problems posted on apollo for a given space.
   *
   * @method getProblemIds
   * @param {string} space - Name of space for which proposal is posted
   * @returns {{ problemhash: string }[]}
   * @public
   */
  public getProblemIds(space: string): Promise<{ problemhash: string }[]> {
    return this.sql<{ problemhash: string }[]>`
      SELECT DISTINCT problemHash FROM reference
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
