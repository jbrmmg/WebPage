import {IListRowLineInterface, ListRowLineType} from "./list-row-line-interface";
import {IMatch} from "../money-match";
import {IAccount} from "../money-account";
import {Category, ICategory} from "../money-category";
import {ListRowLineFactory} from "./list-row-line-factory";

export class ListRowLineReconcile implements IListRowLineInterface {
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

    private reconcile: IMatch;

    private static unknownCategory: ICategory;
    private static selectedCategory: ICategory;

    private static createUiCategories() {
        if(ListRowLineReconcile.unknownCategory == null) {
            ListRowLineReconcile.unknownCategory = new Category("XXXXXns", "Not Set", 0, false, "000000", "none", false, "");
        }

        if(ListRowLineReconcile.selectedCategory == null) {
            ListRowLineReconcile.selectedCategory = new Category("XXXXXs", "Selected", 0, false, "808080", "none", false, "");
        }
    }

    constructor(reconcile: IMatch) {
        let transactionDate: Date = new Date(reconcile.date);

        this.rowType = ListRowLineType.RECONCILE_TRANSACTION;
        this.isTotalRow = false;
        this.hasDate = true;
        this.dateDay = transactionDate.getDay().toString();
        this.dateMonth = ListRowLineFactory.getMonthName(transactionDate.getMonth());
        this.dateYear = transactionDate.getFullYear().toString();
        this.hasAccount = true;
        this.account = reconcile.account;
        this.hasCategory = true;
        this.category = reconcile.category;
        this.description = reconcile.description;
        this.amount = reconcile.amount;
        this.amountDisplay = "?";
        this.hasButtonOne = true;
        this.enableButtonOne = true;
        this.classButtonOne = "fa fa-check";
        this.hasButtonTwo = true;
        this.enableButtonTwo = true;
        this.classButtonTwo = "fa fa-pencil";
        this.hasButtonThree = true;
        this.enableButtonThree = true;
        this.classButtonThree = "fa fa-trash";

        this.reconcile = reconcile;

        // If the category is null, create a special category for display.
        ListRowLineReconcile.createUiCategories();
        if(this.category == null) {
            this.category = ListRowLineReconcile.unknownCategory;
        }
    }

    select() {
        if(this.category.id.startsWith("XXXXX")) {
            if(this.category.id == "XXXXXns") {
                this.category = ListRowLineReconcile.selectedCategory;
            } else {
                this.category = ListRowLineReconcile.unknownCategory;
            }
        }
    }

    clickButtonOne() {
    }

    clickButtonTwo() {
    }

    clickButtonThree() {
    }

    getAmount(): number {
        this.amountDisplay = this.amount.toFixed(2);
        return this.amount;
    }
}
