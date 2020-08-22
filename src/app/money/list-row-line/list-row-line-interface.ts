import {IAccount} from '../money-account';
import {ICategory} from '../money-category';
import {ListRowLine} from './list-row-line';

export enum ListRowLineType {
    TRANSACTION,
    TOTAL_BOUGHT_FORWARD,
    TOTAL_DEBITS,
    TOTAL_CREDITS,
    TOTAL_CARRIED_FORWARD,
    REGULAR_TRANSACTION,
    RECONCILE_TRANSACTION,
    RECONCILE_TOP_LINE
}

export interface IListRowLineInterface extends ListRowLine {
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
    selected: boolean;

    select();
    clickButtonOne();
    clickButtonTwo();
    clickButtonThree();
    completeEdit(id: number, selectedCategory: ICategory, description: string, amount: number);
    categorySelected(selectedCategory: ICategory);

    getAmount(): number;
}
