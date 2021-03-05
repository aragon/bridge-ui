"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Configuration = (function () {
    function Configuration(config) {
        this.ethereum = config.ethereum;
        this.database = config.database;
        this.server = config.server;
    }
    Object.defineProperty(Configuration.prototype, "database", {
        get: function () {
            return this._database;
        },
        set: function (value) {
            this._database = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "ethereum", {
        get: function () {
            return this._ethereum;
        },
        set: function (value) {
            this._ethereum = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "server", {
        get: function () {
            return this._server;
        },
        set: function (value) {
            this._server = value;
        },
        enumerable: false,
        configurable: true
    });
    Configuration.prototype.toObject = function () {
        return {
            ethereum: this._ethereum,
            database: this._database,
            server: this._server
        };
    };
    return Configuration;
}());
exports.default = Configuration;
//# sourceMappingURL=Configuration.js.map