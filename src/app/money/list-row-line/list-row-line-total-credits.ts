import {IListRowLineInterface, ListRowLineType} from "./list-row-line-interface";
import {IAccount} from "../money-account";
import {ICategory} from "../money-category";
import {ListRowSummary} from "./list-row-summary";

export class ListRowLineTotalCredits implements IListRowLineInterface {
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

    private summary: ListRowSummary;

    constructor(summary: ListRowSummary) {
        this.rowType = ListRowLineType.TOTAL_CREDITS;
        this.isTotalRow = true;
        this.hasDate = false;
        this.dateDay = "";
        this.dateMonth = "";
        this.dateYear = "";
        this.hasAccount = false;
        this.account = null;
        this.hasCategory = false;
        this.category = null;
        this.description = "Total Credits";
        this.amount = 0;
        this.amountDisplay = "?";
        this.hasButtonOne = false;
        this.enableButtonOne = false;
        this.classButtonOne = "";
        this.hasButtonTwo = false;
        this.enableButtonTwo = false;
        this.classButtonTwo = "";
        this.hasButtonThree = false;
        this.enableButtonThree = false;
        this.classButtonThree = "";
        this.selected = false;
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
        this.amount = this.summary.totalCredits;
        this.amountDisplay = this.amount.toFixed(2);
        return this.amount;
    }
}
