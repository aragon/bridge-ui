import { FastifyRequest } from 'fastify';
import Whitelist from '../db/Whitelist';
import Admin from '../db/Admin';
export interface AuthenticatedRequest extends FastifyRequest {
    publicKey: string;
    admin: boolean;
}
export default class Authenticator {
    private whitelist;
    private admin;
    private NOT_ALLOWED;
    constructor(whitelist: Whitelist, admin: Admin);
    authenticate(request: FastifyRequest): Promise<undefined>;
    private hasPermission;
}
