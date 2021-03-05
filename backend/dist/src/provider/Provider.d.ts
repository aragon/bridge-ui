import { TransactionReceipt } from '@ethersproject/abstract-provider';
import Wallet from '../wallet/Wallet';
import { EthereumOptions } from '../config/Configuration';
import ContractFunction from '../../lib/transactions/ContractFunction';
export default class Provider {
    private config;
    private wallet;
    private provider;
    constructor(config: EthereumOptions, wallet: Wallet);
    sendTransaction(contract: string, contractFunction: ContractFunction): Promise<TransactionReceipt>;
    private getTransactionOptions;
}
