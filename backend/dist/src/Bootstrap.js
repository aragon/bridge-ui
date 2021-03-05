"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = require("fastify");
var Provider_1 = require("./provider/Provider");
var Wallet_1 = require("./wallet/Wallet");
var Database_1 = require("./db/Database");
var Whitelist_1 = require("./db/Whitelist");
var Admin_1 = require("./db/Admin");
var Authenticator_1 = require("./auth/Authenticator");
var ExecuteTransaction_1 = require("./transactions/execute/ExecuteTransaction");
var ChallengeTransaction_1 = require("./transactions/challenge/ChallengeTransaction");
var ScheduleTransaction_1 = require("./transactions/schedule/ScheduleTransaction");
var CreateTransaction_1 = require("./transactions/create/CreateTransaction");
var AddItemAction_1 = require("./whitelist/AddItemAction");
var DeleteItemAction_1 = require("./whitelist/DeleteItemAction");
var GetListAction_1 = require("./whitelist/GetListAction");
var AbstractTransaction_1 = require("../lib/transactions/AbstractTransaction");
var AbstractWhitelistAction_1 = require("../lib/whitelist/AbstractWhitelistAction");
var Bootstrap = (function () {
    function Bootstrap(config) {
        this.config = config;
        this.setServer();
        this.setDatabase();
        this.setProvider();
        this.registerTestRoute();
    }
    Bootstrap.prototype.run = function () {
        this.server.listen(this.config.server.port, this.config.server.host, function (error, address) {
            if (error) {
                console.error(error);
                process.exit(0);
            }
            console.log("Server is listening at " + address);
        });
    };
    Bootstrap.prototype.registerTestRoute = function () {
        this.server.get("/simple", function (request, reply) {
            console.log(">>>>>>>sdfsdfsd");
            reply
                .code(200)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send({ hello: 'world' });
        });
    };
    Bootstrap.prototype.registerTransactionRoutes = function () {
        var _this = this;
        this.server.post("/execute", { schema: AbstractTransaction_1.default.schema }, function (request) {
            return new ExecuteTransaction_1.default(_this.config.ethereum, _this.provider, _this.whitelist, request).execute();
        });
        this.server.post("/schedule", { schema: AbstractTransaction_1.default.schema }, function (request) {
            return new ScheduleTransaction_1.default(_this.config.ethereum, _this.provider, _this.whitelist, request).execute();
        });
        this.server.post("/challenge", { schema: AbstractTransaction_1.default.schema }, function (request) {
            return new ChallengeTransaction_1.default(_this.config.ethereum, _this.provider, _this.whitelist, request).execute();
        });
        this.server.post("/create", { schema: AbstractTransaction_1.default.schema }, function (request) {
            return new CreateTransaction_1.default(_this.config.ethereum, _this.provider, _this.whitelist, request).execute();
        });
    };
    Bootstrap.prototype.registerWhitelistRoutes = function () {
        var _this = this;
        this.server.post("/whitelist", { schema: AbstractWhitelistAction_1.default.schema }, function (request) {
            return new AddItemAction_1.default(_this.whitelist, request).execute();
        });
        this.server.delete("/whitelist", { schema: AbstractWhitelistAction_1.default.schema }, function (request) {
            return new DeleteItemAction_1.default(_this.whitelist, request).execute();
        });
        this.server.get("/whitelist", { schema: AbstractWhitelistAction_1.default.schema }, function (request) {
            return new GetListAction_1.default(_this.whitelist, request).execute();
        });
    };
    Bootstrap.prototype.setServer = function () {
        var _a;
        this.server = fastify_1.default({
            logger: {
                level: (_a = this.config.server.logLevel) !== null && _a !== void 0 ? _a : "debug",
            },
        });
    };
    Bootstrap.prototype.setDatabase = function () {
        this.database = new Database_1.default(this.config.database);
    };
    Bootstrap.prototype.setProvider = function () {
        this.provider = new Provider_1.default(this.config.ethereum, new Wallet_1.default(this.database));
    };
    Bootstrap.prototype.setupAuth = function () {
        var admin = new Admin_1.default(this.database);
        this.whitelist = new Whitelist_1.default(this.database);
        this.authenticator = new Authenticator_1.default(this.whitelist, admin);
        this.server.addHook("preHandler", this.authenticator.authenticate.bind(this.authenticator));
    };
    return Bootstrap;
}());
exports.default = Bootstrap;
//# sourceMappingURL=Bootstrap.js.map