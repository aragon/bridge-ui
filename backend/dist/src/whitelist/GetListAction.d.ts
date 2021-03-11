import AbstractWhitelistAction from '../../lib/whitelist/AbstractWhitelistAction';
import { ListItem } from '../db/Whitelist';
export default class GetListAction extends AbstractWhitelistAction<ListItem[]> {
    execute(): Promise<ListItem[]>;
}
