import {IListRowLineInterface, ListRowLineType} from "./list-row-line-interface";
import {IAccount} from "../money-account";
import {ICategory} from "../money-category";
import {IStatement} from "../money-statement";
import {MoneyService} from "../money.service";
import {ListRowSummary} from "./list-row-summary";

export class ListRowLineTotalCfwd implements IListRowLineInterface {
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
    private readonly selectedStatement: IStatement;
    private readonly moneyService: MoneyService;

    constructor(moneyService : MoneyService,
                summary: ListRowSummary,
                statement: IStatement ) {
        this.rowType = ListRowLineType.TOTAL_CARRIEDFWD;
        this.isTotalRow = true;
        this.hasDate = false;
        this.dateDay = "";
        this.dateMonth = "";
        this.dateYear = "";
        this.hasAccount = false;
        this.account = null;
        this.hasCategory = false;
        this.category = null;
        this.description = "Carried Forward";
        this.amount = 0;
        this.amountDisplay = "?";
        this.hasButtonOne = false;
        this.enableButtonOne = false;
        this.classButtonOne = "";
        this.hasButtonTwo = false;
        this.enableButtonTwo = false;
        this.classButtonTwo = "";

        if (statement != null) {
            this.hasButtonThree = true;

            if(statement.locked) {
                this.enableButtonThree = false;
                this.classButtonThree = "fa fa-lock";
            } else {
                this.enableButtonThree = true;
                this.classButtonThree = "fa fa-unlock";
            }
        } else {
            this.hasButtonThree = false;
            this.enableButtonThree = false;
            this.classButtonThree = "";
        }

        this.selected = false;
        this.summary = summary;
        this.selectedStatement = statement;
        this.moneyService = moneyService;
    }

    select() {
    }

    clickButtonOne() {
    }

    clickButtonTwo() {
    }

    completeEdit(id: number, selectedCategory: ICategory, description: string, amount: number) {
    }

    clickButtonThree() {
        // If the statement is present and not locked, request the lock.
        if(this.selectedStatement == null || this.selectedStatement.locked)
            return;

        this.moneyService.lockStatement(this.selectedStatement);
    }

    categorySelected(selectedCategory: ICategory) {
    }

    getAmount(): number {
        this.amount = this.summary.carriedForward;
        this.amountDisplay = this.amount.toFixed(2);
        return this.amount;
    }
}
