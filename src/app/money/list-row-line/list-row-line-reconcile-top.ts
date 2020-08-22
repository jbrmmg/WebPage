import {IListRowLineInterface, ListRowLineType} from './list-row-line-interface';
import {IAccount} from '../money-account';
import {ICategory} from '../money-category';
import {MoneyService} from '../money.service';
import {ListRowLine} from './list-row-line';

export class ListRowLineReconcileTop extends ListRowLine implements IListRowLineInterface {
    private readonly moneyService: MoneyService;
    private readonly updateCategory: () => void;

    constructor(moneyService: MoneyService,
                updateCategory: () => void) {
        super();

        this.rowType = ListRowLineType.RECONCILE_TOP_LINE;
        this.hasDate = true;
        this.dateDay = '';
        this.dateMonth = '';
        this.dateYear = '';
        this.amountDisplay = '';
        this.hasButtonOne = true;
        this.enableButtonOne = true;
        this.hasButtonTwo = true;
        this.enableButtonTwo = true;
        this.classButtonTwo = 'fa fa-align-justify';
        this.hasButtonThree = true;
        this.enableButtonThree = true;
        this.classButtonThree = 'fa fa-eraser';
        this.moneyService = moneyService;
        this.updateCategory = updateCategory;
    }

    select() {
    }

    clickButtonOne() {
        // Auto accept transactions.
        this.moneyService.autoAccept();
    }

    clickButtonTwo() {
        // Set category.
        this.updateCategory();
    }

    clickButtonThree() {
        // Auto accept transactions.
        this.moneyService.clearRecData();
    }

    completeEdit(id: number, selectedCategory: ICategory, description: string, amount: number) {
    }

    categorySelected(selectedCategory: ICategory) {
    }

    getAmount(): number {
        this.amountDisplay = '';
        return 0;
    }
}
