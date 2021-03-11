import { JsonFragment } from '@ethersproject/abi';
import AbstractTransaction from '../../../lib/transactions/AbstractTransaction';
export default class ScheduleTransaction extends AbstractTransaction {
    protected contract: string;
    protected functionABI: JsonFragment;
}
