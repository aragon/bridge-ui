import { FastifyRequest, FastifySchema } from 'fastify';
import AbstractAction, { Params } from '../AbstractAction';
import Whitelist from '../../src/db/Whitelist';
export interface WhitelistParams extends Params {
    message: {
        publicKey: string;
        txLimit?: number;
    };
}
export default abstract class AbstractWhitelistAction<T> extends AbstractAction<T> {
    protected whitelist: Whitelist;
    constructor(whitelist: Whitelist, request: FastifyRequest);
    abstract execute(): Promise<T>;
    static get schema(): FastifySchema;
}
