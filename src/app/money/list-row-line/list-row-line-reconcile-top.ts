import {IListRowLineInterface, ListRowLineType} from './list-row-line-interface';
import {IAccount} from '../money-account';
import {ICategory} from '../money-category';
import {MoneyService} from '../money.service';

export class ListRowLineReconcileTop implements IListRowLineInterface {
    public rowType: ListRowLineType;
    public isTotalRow: boolean;
    public hasDate: boolean;
    public dateDay: string;
    public dateMonth: string;
    public dateYear: string;
    public hasAccount: boolean;
    public account: IAccount;
    public hasCategory: boolean;
    public category: ICategory;
    public description: string;
    public amount: number;
    public amountDisplay: string;
    public hasButtonOne: boolean;
    public enableButtonOne: boolean;
    public classButtonOne: string;
    public hasButtonTwo: boolean;
    public enableButtonTwo: boolean;
    public classButtonTwo: string;
    public hasButtonThree: boolean;
    public enableButtonThree: boolean;
    public classButtonThree: string;
    public selected: boolean;

    private readonly moneyService: MoneyService;
    private readonly updateCategory: () => void;

    constructor(moneyService: MoneyService,
                updateCategory: () => void) {
        this.rowType = ListRowLineType.RECONCILE_TOP_LINE;
        this.isTotalRow = false;
        this.hasDate = true;
        this.dateDay = '';
        this.dateMonth = '';
        this.dateYear = '';
        this.hasAccount = false;
        this.account = null;
        this.hasCategory = false;
        this.category = null;
        this.description = '';
        this.amount = 0;
        this.amountDisplay = '';
        this.hasButtonOne = true;
        this.enableButtonOne = true;
        this.classButtonOne = 'fa fa-check';
        this.hasButtonTwo = true;
        this.enableButtonTwo = true;
        this.classButtonTwo = 'fa fa-align-justify';
        this.hasButtonThree = true;
        this.enableButtonThree = true;
        this.classButtonThree = 'fa fa-eraser';
        this.selected = false;
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
