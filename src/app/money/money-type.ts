/*
 * Internal - loaded from a file.
 */

export interface ITransactionType {
    id: string;
    name: string;
    icon: string;
}

export class TransactionType implements ITransactionType {
    constructor(public id: string,
                public name: string,
                public icon: string ) {
    }
}
