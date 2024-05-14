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
}
