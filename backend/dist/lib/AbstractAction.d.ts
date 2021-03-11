import { FastifySchema, FastifyRequest } from 'fastify';
export interface Params {
    message: string | any;
    signature: string;
}
export default abstract class AbstractAction<T> {
    protected request: FastifyRequest;
    constructor(request: FastifyRequest);
    protected validateRequest(request: FastifyRequest): FastifyRequest;
    abstract execute(): Promise<T>;
    static get schema(): FastifySchema;
}
