import { JsonFragment } from '@ethersproject/abi';
export default class ContractFunction {
    private requestMsg;
    functionArguments: any[];
    private abiItem;
    constructor(abiItem: JsonFragment, requestMsg: string);
    encode(): string;
    decode(): any[];
}
