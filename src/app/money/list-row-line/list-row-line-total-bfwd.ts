import {IListRowLineInterface, ListRowLineType} from './list-row-line-interface';
import {ICategory} from '../money-category';
import {ListRowSummary} from './list-row-summary';
import {ListRowLine} from './list-row-line';

export class ListRowLineTotalBfwd extends ListRowLine implements IListRowLineInterface {
    private summary: ListRowSummary;

    constructor(summary: ListRowSummary) {
        super();

        this.rowType = ListRowLineType.TOTAL_BOUGHT_FORWARD;
        this.isTotalRow = true;
        this.description = 'Bought Forward';
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
        this.amount = this.summary.boughtFwd;
        this.amountDisplay = this.amount.toFixed(2);
        return this.amount;
    }
}
