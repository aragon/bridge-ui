"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prod_config_1 = require("../config/prod.config");
var dev_config_1 = require("../config/dev.config");
var Configuration_1 = require("./config/Configuration");
var Bootstrap_1 = require("./Bootstrap");
function test() {
    console.log("oiuoiu");
}
new Bootstrap_1.default(new Configuration_1.default(process.env.DEV ? dev_config_1.config : prod_config_1.config)).run();
//# sourceMappingURL=index.js.map