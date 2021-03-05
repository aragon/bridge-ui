"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var address_1 = require("@ethersproject/address");
var AbstractWhitelistAction_1 = require("../../lib/whitelist/AbstractWhitelistAction");
var DeleteItemAction = (function (_super) {
    __extends(DeleteItemAction, _super);
    function DeleteItemAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteItemAction.prototype.validateRequest = function (request) {
        if (!address_1.isAddress(request.body.message.publicKey)) {
            throw new Error('Invalid public key passed!');
        }
        return request;
    };
    DeleteItemAction.prototype.execute = function () {
        return this.whitelist.deleteItem(this.request.body.message.publicKey);
    };
    return DeleteItemAction;
}(AbstractWhitelistAction_1.default));
exports.default = DeleteItemAction;
//# sourceMappingURL=DeleteItemAction.js.map