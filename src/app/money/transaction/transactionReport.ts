/*
 * Equivalent TransactionReportDTO
 */

import {IFinancialAmount} from "./financialamount";
import {IAccount} from "../account/jbaccount";
import {ICategory} from "../category/category";
import {IStatement} from "../statement/statement";
import {TransactionEditType} from "./transactionEditType";

export interface ITransactionReport {
    new: boolean;
    editing: TransactionEditType;
    modified: boolean;
    transferAccountId: string;
    id: number;
    type: string;
    amount: IFinancialAmount;
    balance: IFinancialAmount;
    date: string;
    account: IAccount;
    category: ICategory;
    description: string;
    oppositeId: number;
    transactionId: number;
    statement: IStatement;
    predicted: boolean;
    fromReconciliation: boolean;
    selected: boolean;
    selectable: boolean;
    actionUpdate: boolean;
    actionReconcile: boolean;
    actionUnreconcile: boolean;
    actionDelete: boolean;
}

export class TransactionReport implements ITransactionReport {
    new: boolean;
    editing: TransactionEditType;
    modified: boolean;
    transferAccountId: string;
    account: IAccount;
    amount: IFinancialAmount;
    balance: IFinancialAmount;
    category: ICategory;
    date: string;
    description: string;
    fromReconciliation: boolean;
    id: number;
    oppositeId: number;
    transactionId: number;
    predicted: boolean;
    statement: IStatement;
    type: string;
    selected: boolean;
    selectable: boolean;
    actionUpdate: boolean;
    actionReconcile: boolean;
    actionUnreconcile: boolean;
    actionDelete: boolean;

    constructor() {
        this.new = false;
        this.selected = false;
        this.selectable = false;
        this.editing = TransactionEditType.None;
        this.modified = false;
        this.transferAccountId = "";
    }

    public static get TRANSACTION():string {return "TRANSACTION"};
    public static get OPEN_BALANCE():string {return "OPEN_BALANCE"};
    public static get TODAY_BALANCE():string {return "TODAY_BALANCE"};
    public static get FUTURE_BALANCE():string {return "FUTURE_BALANCE"};
}
