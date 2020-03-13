import {IAccount} from "../money-account";
import {ICategory} from "../money-category";

export enum ListRowLineType {
    TRANSACTION,
    TOTAL_BOUGHTFWD,
    TOTAL_DEBITS,
    TOTAL_CREDITS,
    TOTAL_CARRIEDFWD,
    REGULAR_TRANSACTION,
    RECONCILE_TRANSACTION,
    RECONCILE_TOP_LINE
}

export interface IListRowLineInterface {
    rowType: ListRowLineType;
    isTotalRow: boolean;
    hasDate: boolean;
    dateDay: string;
    dateMonth: string;
    dateYear: string;
    hasAccount: boolean;
    account: IAccount;
    hasCategory: boolean;
    category: ICategory;
    description: string;
    amount: number;
    amountDisplay: string;
    hasButtonOne: boolean;
    enableButtonOne: boolean;
    classButtonOne: string;
    hasButtonTwo: boolean;
    enableButtonTwo: boolean;
    classButtonTwo: string;
    hasButtonThree: boolean;
    enableButtonThree: boolean;
    classButtonThree: string;

    select();
    clickButtonOne();
    clickButtonTwo();
    clickButtonThree();

    getAmount() : number;
}
