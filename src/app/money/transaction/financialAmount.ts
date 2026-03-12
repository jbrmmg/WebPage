/*
* Equivalent of FinancialAmount
*/

export interface IFinancialAmount {
    value: number;
    type: string;
}

export class FinancialAmount implements IFinancialAmount {
    constructor(public value: number,
                public type: string ) {
    }

    public static get DEBIT(): string { return 'DB'; }
    public static get CREDIT(): string { return 'CR'; }
}
