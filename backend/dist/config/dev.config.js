"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    ethereum: {
        publicKey: '',
        contracts: {
            GovernQueue: '',
            GovernBaseFactory: ''
        },
        url: 'http://localhost:8545',
        blockConfirmations: 42
    },
    database: {
        user: 'govern-tx',
        host: 'localhost',
        password: 'tx-service',
        database: 'govern-tx',
        port: 5432
    },
    server: {
        host: '0.0.0.0',
        port: 4040
    }
};
//# sourceMappingURL=dev.config.js.map