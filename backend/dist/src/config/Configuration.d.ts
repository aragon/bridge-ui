export interface EthereumOptions {
    url: string;
    blockConfirmations: number;
    publicKey: string;
    contracts: {
        [name: string]: string;
    };
}
export interface DatabaseOptions {
    user: string;
    host: string;
    password: string;
    database: string;
    port: number;
}
export interface ServerOptions {
    host: string;
    port: number;
    logLevel?: string;
}
export interface Config {
    ethereum: EthereumOptions;
    database: DatabaseOptions;
    server: ServerOptions;
}
export default class Configuration {
    private _ethereum;
    private _database;
    private _server;
    constructor(config: Config);
    get database(): DatabaseOptions;
    set database(value: DatabaseOptions);
    get ethereum(): EthereumOptions;
    set ethereum(value: EthereumOptions);
    get server(): ServerOptions;
    set server(value: ServerOptions);
    toObject(): any;
}
