"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var abi_1 = require("@ethersproject/abi");
var hash_1 = require("@ethersproject/hash");
var ContractFunction = (function () {
    function ContractFunction(abiItem, requestMsg) {
        this.requestMsg = requestMsg;
        this.abiItem = abi_1.Fragment.fromObject(abiItem);
        this.functionArguments = this.decode();
    }
    ContractFunction.prototype.encode = function () {
        return hash_1.id(this.abiItem.format()) +
            (abi_1.defaultAbiCoder.encode(this.abiItem.inputs, this.functionArguments).replace('0x', ''));
    };
    ContractFunction.prototype.decode = function () {
        return abi_1.defaultAbiCoder.decode(this.abiItem.inputs, '0x' + this.requestMsg.slice(10));
    };
    return ContractFunction;
}());
exports.default = ContractFunction;
//# sourceMappingURL=ContractFunction.js.map