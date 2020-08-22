import {IListRowLineInterface, ListRowLineType} from './list-row-line-interface';
import {IAccount} from '../money-account';
import {ICategory} from '../money-category';
import {ListRowSummary} from './list-row-summary';
import {ListRowLine} from './list-row-line';

export class ListRowLineTotalDebits extends ListRowLine implements IListRowLineInterface {
    private summary: ListRowSummary;

    constructor(summary: ListRowSummary) {
        super();

        this.rowType = ListRowLineType.TOTAL_DEBITS;
        this.isTotalRow = true;
        this.description = 'Total Debits';
        this.summary = summary;
    }

    select() {
    }

    clickButtonOne() {
    }

    clickButtonTwo() {
    }

    clickButtonThree() {
    }

    completeEdit(id: number, selectedCategory: ICategory, description: string, amount: number) {
    }

    categorySelected(selectedCategory: ICategory) {
    }

    getAmount(): number {
        this.amount = this.summary.totalDebits;
        this.amountDisplay = this.amount.toFixed(2);
        return this.amount;
    }
}
