import { FastifyRequest } from 'fastify';
import AbstractWhitelistAction from "../../lib/whitelist/AbstractWhitelistAction";
import { ListItem } from '../db/Whitelist';
export default class AddItemAction extends AbstractWhitelistAction<ListItem> {
    protected validateRequest(request: FastifyRequest): FastifyRequest;
    execute(): Promise<ListItem>;
}
