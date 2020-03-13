import {IListRowLineInterface, ListRowLineType} from "./list-row-line-interface";
import {IRegular} from "../money-regular";
import {IAccount} from "../money-account";
import {ICategory} from "../money-category";
import {getAllRouteGuards} from "@angular/router/src/utils/preactivation";
import {ListRowLineFactory} from "./list-row-line-factory";

export class ListRowLineRegular implements IListRowLineInterface {
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

    private regular: IRegular;

    constructor(regular: IRegular) {
        this.rowType = ListRowLineType.REGULAR_TRANSACTION;
        this.isTotalRow = false;
        if(regular.lastDate == null) {
            this.hasDate = false;
            this.dateDay = "";
            this.dateMonth = "";
            this.dateYear = "";
        } else {
            this.hasDate = true;
            let paymentDate: Date = new Date(regular.lastDate);

            this.dateDay = paymentDate.getDay().toString();
            this.dateMonth = ListRowLineFactory.getMonthName(paymentDate.getMonth());
            this.dateYear = paymentDate.getFullYear().toString();
        }
        this.hasAccount = true;
        this.account = regular.account;
        this.hasCategory = true;
        this.category = regular.category;
        this.description = regular.description;
        this.amount = regular.amount;
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

    getAmount(): number {
        this.amountDisplay = this.amount.toFixed(2);
        return this.amount;
    }
}
