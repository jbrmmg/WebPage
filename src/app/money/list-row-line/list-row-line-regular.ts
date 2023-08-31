import {IListRowLineInterface, ListRowLineType} from './list-row-line-interface';
import {IRegular} from '../money-regular';
import {ICategory} from '../money-category';
import {ListRowLineTransaction} from './list-row-line-transaction';
import {ListRowLine} from './list-row-line';

export class ListRowLineRegular extends ListRowLine implements IListRowLineInterface {
    private regular: IRegular;

    constructor(regular: IRegular) {
        super();

        this.rowType = ListRowLineType.REGULAR_TRANSACTION;
        if (regular.lastCreated != null) {
            this.hasDate = true;
            const paymentDate: Date = new Date(regular.lastCreated);

            this.dateDay = paymentDate.getDate().toString();
            this.dateMonth = ListRowLineTransaction.getMonthName(paymentDate.getMonth());
            this.dateYear = paymentDate.getFullYear().toString();
        }
        this.hasAccount = true;
        this.accountId = regular.accountId;
        this.hasCategory = true;
        this.categoryId = regular.categoryId;
        this.description = regular.description;
        this.amount = regular.amount;
        this.classButtonOne = '';
        this.classButtonTwo = '';
        this.classButtonThree = '';

        this.regular = regular;
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
        this.amountDisplay = this.amount.toFixed(2);
        return this.amount;
    }
}
