import {IListRowLineInterface, ListRowLineType} from "./list-row-line-interface";
import {IAccount} from "../money-account";
import {ICategory} from "../money-category";

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

    constructor() {
        this.rowType = ListRowLineType.RECONCILE_TOP_LINE;
        this.isTotalRow = false;
        this.hasDate = true;
        this.dateDay = "";
        this.dateMonth = "";
        this.dateYear = "";
        this.hasAccount = false;
        this.account = null;
        this.hasCategory = false;
        this.category = null;
        this.description = "";
        this.amount = 0;
        this.amountDisplay = "";
        this.hasButtonOne = true;
        this.enableButtonOne = true;
        this.classButtonOne = "fa fa-check";
        this.hasButtonTwo = true;
        this.enableButtonTwo = true;
        this.classButtonTwo = "fa fa-pencil";
        this.hasButtonThree = true;
        this.enableButtonThree = true;
        this.classButtonThree = "fa fa-trash";
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
        this.amountDisplay = "";
        return 0;
    }
}
