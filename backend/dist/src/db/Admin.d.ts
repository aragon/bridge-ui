import Database from './Database';
export interface AdminItem {
    PublicKey: string;
    PrivateKey: string;
}
export default class Admin {
    private db;
    constructor(db: Database);
    isAdmin(publicKey: string): Promise<boolean>;
    addAdmin(publicKey: string): Promise<AdminItem>;
    deleteAdmin(publicKey: string): Promise<boolean>;
    getAdmins(): Promise<AdminItem[]>;
}
