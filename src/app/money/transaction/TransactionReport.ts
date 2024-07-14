/*
 * Equivalent TransactionReportDTO
 */

import {FinancialAmount, IFinancialAmount} from "./financialamount";
import {IAccount, JbAccount} from "../account/jbaccount";
import {Category, ICategory} from "../category/category";
import {IStatement, Statement} from "../statement/statement";

export interface ITransactionReport {
    id: number;
    type: string;
    amount: IFinancialAmount;
    balance: IFinancialAmount;
    date: string;
    account: IAccount;
    category: ICategory;
    description: string;
    oppositeId: number;
    statement: IStatement;
    predicted: boolean;
    fromReconciliation: boolean;
}

export class TransactionReport {
    constructor(
        public id: number,
        public amount: FinancialAmount,
        public balance: FinancialAmount,
        public date: string,
        public account: JbAccount,
        public category: Category,
        public description: string,
        public oppositeId: number,
        public statement: Statement,
        public predicted: boolean,
        public fromReconciliation: boolean) {
    }
}
