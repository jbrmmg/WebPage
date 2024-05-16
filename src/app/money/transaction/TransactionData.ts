/*
 * Equivalent TransactionDataDTO
 */

import {IFinancialAmount} from "./financialamount";
import {ITransactionReport} from "./TransactionReport";

export interface ITransactionData {
    openDate: string;
    openBalance: IFinancialAmount;
    transactions: ITransactionReport[];
    today: string;
    todayBalance: IFinancialAmount;
    forwardDate: string;
    forwardBalance: IFinancialAmount;
}

export class TransactionReport {
    constructor(public openDate: string,
                public openBalance: IFinancialAmount,
                public transactions: ITransactionReport[],
                public today: string,
                public todayBalance: IFinancialAmount,
                public forwardDate: string,
                public forwardBalance: IFinancialAmount) {
    }
}
