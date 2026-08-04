/*
 * Equivalent TransactionReportDTO
 */

import {IFinancialAmount} from './financialAmount';
import {IAccount} from '../account/jbAccount';
import {ICategory} from '../category/category';
import {IStatement} from '../statement/statement';
import {TransactionEditType} from './transactionEditType';

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
    new = false;
    editing: TransactionEditType = TransactionEditType.None;
    modified = false;
    transferAccountId = '';
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
    selected = false;
    selectable = false;
    actionUpdate: boolean;
    actionReconcile: boolean;
    actionUnreconcile: boolean;
    actionDelete: boolean;

    public static get TRANSACTION(): string {return 'TRANSACTION'; }
    public static get OPEN_BALANCE(): string {return 'OPEN_BALANCE'; }
    public static get TODAY_BALANCE(): string {return 'TODAY_BALANCE'; }
    public static get FUTURE_BALANCE(): string {return 'FUTURE_BALANCE'; }
    public static get CARRIED_FORWARD_BALANCE(): string {return 'CARRIED_FORWARD_BALANCE'; }
}
