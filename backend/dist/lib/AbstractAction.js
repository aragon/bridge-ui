"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractAction = (function () {
    function AbstractAction(request) {
        this.request = this.validateRequest(request);
    }
    AbstractAction.prototype.validateRequest = function (request) {
        return request;
    };
    Object.defineProperty(AbstractAction, "schema", {
        get: function () {
            return {
                body: {
                    type: 'object',
                    required: ['message', 'signature'],
                    properties: {
                        message: {
                            oneOf: [
                                { type: 'string' },
                                { type: 'object' }
                            ]
                        },
                        signature: { type: 'string' }
                    }
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    return AbstractAction;
}());
exports.default = AbstractAction;
//# sourceMappingURL=AbstractAction.js.map