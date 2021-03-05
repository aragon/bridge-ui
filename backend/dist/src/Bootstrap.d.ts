import Configuration from "./config/Configuration";
export default class Bootstrap {
    private config;
    private server;
    private authenticator;
    private whitelist;
    private provider;
    private database;
    constructor(config: Configuration);
    run(): void;
    private registerTestRoute;
    private registerTransactionRoutes;
    private registerWhitelistRoutes;
    private setServer;
    private setDatabase;
    private setProvider;
    private setupAuth;
}
