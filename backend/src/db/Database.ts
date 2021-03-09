import postgres = require("postgres");
import { DatabaseOptions } from "../config/Configuration";

export default class Database {
  /**
   * The sql function of the postgres client
   *
   * @property {Function} sql
   *
   * @private
   */
  private sql: any;

  /**
   * @param {DatabaseOptions} config - The database configuration
   *
   * @constructor
   */
  constructor(private config: DatabaseOptions) {
    this.connect();
  }

  /**
   * Establishes the connection to the postgres DB
   *
   * @method connect
   *
   * @returns {void}
   *
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
   *
   * @param {string} query - The SQL statement
   *
   * @returns {Promise<any>}
   *
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

  public addProblemProposal<T>(space: string, proposalHash: string): Promise<T> {
    return this.sql`
      INSERT INTO reference (spaceName, problemHash, solutionHash)
      VALUES (${space}, ${proposalHash}, null);
      `;
  }
}
