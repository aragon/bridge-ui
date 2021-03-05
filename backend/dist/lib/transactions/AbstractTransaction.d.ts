import { FastifySchema, FastifyRequest } from 'fastify';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { JsonFragment } from '@ethersproject/abi';
import AbstractAction from '../AbstractAction';
import Provider from '../../src/provider/Provider';
import { EthereumOptions } from '../../src/config/Configuration';
import Whitelist from '../../src/db/Whitelist';
export default abstract class AbstractTransaction extends AbstractAction<TransactionReceipt> {
    private config;
    private provider;
    private whitelist;
    protected functionABI: JsonFragment;
    protected contract: string;
    constructor(config: EthereumOptions, provider: Provider, whitelist: Whitelist, request: FastifyRequest);
    execute(): Promise<TransactionReceipt>;
    static get schema(): FastifySchema;
}
