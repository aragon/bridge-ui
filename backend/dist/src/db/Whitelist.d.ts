import Database from './Database';
export interface ListItem {
    PublicKey: string;
    Limit: number;
    Executed: number;
}
export default class Whitelist {
    private db;
    constructor(db: Database);
    getList(): Promise<ListItem[]>;
    keyExists(publicKey: string): Promise<boolean>;
    getItemByKey(publicKey: string): Promise<ListItem>;
    addItem(publicKey: string, rateLimit: number): Promise<ListItem>;
    deleteItem(publicKey: string): Promise<boolean>;
    increaseExecutionCounter(publicKey: string): Promise<number>;
    limitReached(publicKey: string): Promise<boolean>;
}
