import { FastifyRequest } from 'fastify';
import AbstractWhitelistAction from "../../lib/whitelist/AbstractWhitelistAction";
export default class DeleteItemAction extends AbstractWhitelistAction<boolean> {
    protected validateRequest(request: FastifyRequest): FastifyRequest;
    execute(): Promise<boolean>;
}
