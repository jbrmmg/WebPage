import {IListRowLineInterface, ListRowLineType} from "./list-row-line-interface";
import {IMatch} from "../money-match";
import {IAccount} from "../money-account";
import {Category, ICategory} from "../money-category";
import {ListRowLineTransaction} from "./list-row-line-transaction";
import {MoneyService, NewTransaction} from "../money.service";
import {MoneyCalcButtonDelete} from "../calculator/money-calc-btn";

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
    public selected: boolean;

    private readonly reconcile: IMatch;
    private moneyService: MoneyService;
    private reconcileAction: boolean;

    private static unknownCategory: ICategory;
    private static selectedCategory: ICategory;

    private static createUiCategories() {
        if (ListRowLineReconcile.unknownCategory == null) {
            ListRowLineReconcile.unknownCategory = new Category("XXXXXns", "Not Set", 0, false, "000000", "none", false, "");
        }

        if (ListRowLineReconcile.selectedCategory == null) {
            ListRowLineReconcile.selectedCategory = new Category("XXXXXs", "Selected", 0, false, "808080", "none", false, "");
        }
    }

    constructor(moneyService: MoneyService,
                reconcile: IMatch) {
        let transactionDate: Date = new Date(reconcile.date);

        this.rowType = ListRowLineType.RECONCILE_TRANSACTION;
        this.isTotalRow = false;
        this.hasDate = true;
        this.dateDay = transactionDate.getDate().toString();
        this.dateMonth = ListRowLineTransaction.getMonthName(transactionDate.getMonth());
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
        this.selected = false;

        this.reconcile = reconcile;
        this.moneyService = moneyService;

        if(this.description == null) {
            if(reconcile.transaction != null) {
                this.description = reconcile.transaction.description;
            }
        }

        // If the category is null, create a special category for display.
        ListRowLineReconcile.createUiCategories();
        if (this.category == null) {
            this.category = ListRowLineReconcile.unknownCategory;
        }

        // Buttons depend on the forward and backward actions.
        this.reconcileAction = true;
        switch(this.reconcile.forwardAction + "-" + this.reconcile.backwardAction) {
            case "SETCATEGORY-NONE":
                // Disable all - need to select category first.
                this.enableButtonOne = false;
                this.enableButtonTwo = false;
                this.enableButtonThree = false;
                break;

            case "CREATE-NONE":
                // Middle button will create.
                this.enableButtonOne = false;
                this.enableButtonThree = false;
                this.classButtonTwo = "fa fa-check";
                break;

            case "NONE-UNRECONCILE":
                // This is a reconciled transaction - don't allow anything.
                this.enableButtonOne = false;
                this.enableButtonTwo = false;
                this.enableButtonThree = false;
                break;

            case "UNRECONCILE-NONE":
                // This is a transaction that is not in the file.
                this.enableButtonTwo = false;
                this.enableButtonThree = false;
                this.classButtonOne = "fa fa-times";
                this.reconcileAction = false;
                break;

            case "RECONCILE-DELETE":
                // Button 1 tick reconcile, button 3 = trash (delete)
                this.enableButtonTwo = false;
                break;
        }
    }

    select() {
        if (this.category.id.startsWith("XXXXX")) {
            if (!this.selected) {
                this.category = ListRowLineReconcile.selectedCategory;
                this.selected = true;
            } else {
                this.category = ListRowLineReconcile.unknownCategory;
                this.selected = false;
            }
        }
    }

    clickButtonOne() {
        // Reconcile or un-reconcile.
        this.moneyService.confirmTransaction(this.reconcile.transaction,this.reconcileAction);
    }

    clickButtonTwo() {
        // Always create.
        let newTransaction: NewTransaction = new NewTransaction();
        newTransaction.amount = this.reconcile.amount;
        newTransaction.date = this.reconcile.date;
        newTransaction.accountId = this.reconcile.account.id;
        newTransaction.description = this.reconcile.description;
        newTransaction.accountTransfer = false;
        newTransaction.categoryId = this.reconcile.category.id;

        this.moneyService.addTransaction(newTransaction);
    }

    clickButtonThree() {
        // Always delete
        this.moneyService.deleteTransaction(this.reconcile.transaction);
    }

    completeEdit(id: number, selectedCategory: ICategory, description: string, amount: number) {
    }

    categorySelected(selectedCategory: ICategory) {
        if(!this.selected) {
            return;
        }

        // Update the category.
        this.moneyService.setCategory(this.reconcile, selectedCategory);
        this.category = selectedCategory;
        this.selected = false;
    }

    getAmount(): number {
        this.amountDisplay = this.amount.toFixed(2);
        return this.amount;
    }
}
