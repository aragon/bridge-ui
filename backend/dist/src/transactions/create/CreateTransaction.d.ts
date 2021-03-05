import { JsonFragment } from '@ethersproject/abi';
import AbstractTransaction from '../../../lib/transactions/AbstractTransaction';
export default class CreateTransaction extends AbstractTransaction {
    protected contract: string;
    protected functionABI: JsonFragment;
}
