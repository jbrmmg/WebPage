/*
* Equivalent of TransactionFilterDTO
*/

import {ValueRange} from '../range/valueRange';
import {DateRange} from '../range/dateRange';
import {StatementDate} from '../statement/statementDate';
import {JbAccount} from '../account/jbAccount';
import {Category} from '../category/category';

export class TransactionFilter {
    public valueRange?: ValueRange;
    public dateRange?: DateRange;
    public statementDate?: StatementDate;
    public accounts?: JbAccount[];
    public categories?: Category[];
    public locked?: boolean;
    public predicted?: boolean;
    public fromReconciled?: boolean;
    public description?: string;
    public maxPageSize?: number;
    public statementAge?: number;
    public pageNumber?: number;
}
