import { DatabaseOptions } from '../config/Configuration';
export default class Database {
    private config;
    private sql;
    constructor(config: DatabaseOptions);
    private connect;
    query<T>(query: string): Promise<T>;
}
