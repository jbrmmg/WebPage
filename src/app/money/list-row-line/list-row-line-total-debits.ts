import {IListRowLineInterface, ListRowLineType} from "./list-row-line-interface";
import {IAccount} from "../money-account";
import {ICategory} from "../money-category";
import {TransactionSummary} from "../money-transaction";

export class ListRowLineTotalDebits implements IListRowLineInterface {
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

    private summary: TransactionSummary;

    constructor(summary: TransactionSummary) {
        this.rowType = ListRowLineType.TOTAL_DEBITS;
        this.isTotalRow = true;
        this.hasDate = false;
        this.dateDay = "";
        this.dateMonth = "";
        this.dateYear = "";
        this.hasAccount = false;
        this.account = null;
        this.hasCategory = false;
        this.category = null;
        this.description = "Total Debits";
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

    getAmount(): number {
        this.amount = this.summary.totalDebits;
        this.amountDisplay = this.amount.toFixed(2);
        return this.amount;
    }
}
