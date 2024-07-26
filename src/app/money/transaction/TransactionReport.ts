/*
 * Equivalent TransactionReportDTO
 */

import {FinancialAmount, IFinancialAmount} from "./financialamount";
import {IAccount, JbAccount} from "../account/jbaccount";
import {Category, ICategory} from "../category/category";
import {IStatement, Statement} from "../statement/statement";

export interface ITransactionReport {
    new: boolean;
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

export class TransactionReport implements ITransactionReport {
    new: boolean;
    account: IAccount;
    amount: IFinancialAmount;
    balance: IFinancialAmount;
    category: ICategory;
    date: string;
    description: string;
    fromReconciliation: boolean;
    id: number;
    oppositeId: number;
    predicted: boolean;
    statement: IStatement;
    type: string;

    constructor() {
        this.new = true;
    }
}
