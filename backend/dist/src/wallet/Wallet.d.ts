import { TransactionRequest } from '@ethersproject/providers';
import Database from '../db/Database';
export interface WalletItem {
    PrivateKey: string;
    PublicKey: string;
}
export default class Wallet {
    private db;
    private wallet;
    private publicKey;
    constructor(db: Database);
    sign(txOptions: TransactionRequest, publicKey: string): Promise<string>;
    private loadWallet;
}
