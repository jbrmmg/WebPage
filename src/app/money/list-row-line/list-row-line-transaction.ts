import {IListRowLineInterface, ListRowLineType} from "./list-row-line-interface";
import {ITransaction, TransactionSummary} from "../money-transaction";
import {IAccount} from "../money-account";
import {ICategory} from "../money-category";
import {ListRowLineFactory} from "./list-row-line-factory";

export class ListRowLineTransaction implements IListRowLineInterface {
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

    private transaction: ITransaction;
    private summary: TransactionSummary;

    constructor(transaction: ITransaction,
                summary: TransactionSummary) {
        let transactionDate: Date = new Date(transaction.date);

        this.rowType = ListRowLineType.TRANSACTION;
        this.isTotalRow = false;
        this.hasDate = true;
        this.dateDay = transactionDate.getDay().toString();
        this.dateMonth = ListRowLineFactory.getMonthName(transactionDate.getMonth());
        this.dateYear = transactionDate.getFullYear().toString();
        this.hasAccount = true;
        this.account = transaction.account;
        this.hasCategory = true;
        this.category = transaction.category;
        this.description = transaction.description;
        this.amount = transaction.amount;
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

        this.transaction = transaction;
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
        this.amountDisplay = this.amount.toFixed(2);
        return this.amount;
    }
}
