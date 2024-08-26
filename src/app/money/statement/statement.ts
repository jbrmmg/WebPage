/*
 * Equivalent of StatementIdDTO
 */

import {IFinancialAmount, FinancialAmount} from "../transaction/financialAmount";

export interface IStatementId {
    accountId: string;
    month: number;
    year: number;
}

/*
 * Equivalent of StatementDTO
 */

export interface IStatement {
    accountId: string;
    month: number;
    year: number;
    openBalance: IFinancialAmount;
    locked: boolean;
}

export class Statement implements IStatement {
    selected: boolean;

    constructor(public accountId: string,
                public month: number,
                public year: number,
                public openBalance: FinancialAmount,
                public locked: boolean ) {
    }
}
