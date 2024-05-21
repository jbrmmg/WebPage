/*
* Equivalent of TransactionFilterDTO
*/

import {IValueRange, ValueRange} from "../range/valueRange";
import {DateRange, IDateRange} from "../range/dateRange";
import {IStatementDate, StatementDate} from "../statement/statementDate";
import {IAccount,JbAccount} from "../account/jbaccount";
import {Category, ICategory} from "../category/category";

export interface ITransactionFilter {
    valueRange?: IValueRange;
    dateRange?: IDateRange;
    statementDate?: IStatementDate;
    accounts?: IAccount[];
    categories?: ICategory[];
    locked?: boolean;
    predicted?: boolean;
    fromReconciled?: boolean;
    reconciliationAccount?: string;
}

export class TransactionFilter {
    public valueRange?: ValueRange;
    public dateRange?: DateRange;
    public statementDate?: StatementDate;
    public accounts?: JbAccount[];
    public categories?: Category[];
    public locked?: boolean;
    public predicted?: boolean;
    public fromReconciled?: boolean;
    public reconciliationAccount?: string;
}
