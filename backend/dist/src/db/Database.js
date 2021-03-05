"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var postgres = require("postgres");
var Database = (function () {
    function Database(config) {
        this.config = config;
        this.connect();
    }
    Database.prototype.connect = function () {
        this.sql = postgres({
            host: this.config.host,
            port: this.config.port,
            database: this.config.database,
            username: this.config.user,
            password: this.config.password
        });
    };
    Database.prototype.query = function (query) {
        return this.sql(query);
    };
    return Database;
}());
exports.default = Database;
//# sourceMappingURL=Database.js.map