import {IListRowLineInterface, ListRowLineType} from './list-row-line-interface';
import {ICategory} from '../money-category';
import {ListRowLine} from './list-row-line';

export class ListRowLineHeader extends ListRowLine implements IListRowLineInterface {
    constructor() {
        super();

        this.rowType = ListRowLineType.HEADER;
        this.isTotalRow = true;
        this.description = 'Description';
        this.dateDay = 'Day';
        this.dateMonth = 'Month'
        this.hasButtonOne = false;
        this.hasButtonTwo = false;
        this.hasButtonThree = false;
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
        return 0;
    }
}
