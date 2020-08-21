import {IListRowLineInterface, ListRowLineType} from './list-row-line-interface';
import {IAccount} from '../money-account';
import {ICategory} from '../money-category';
import {MoneyService} from '../money.service';
import {ITransaction, ListRowSummary} from './list-row-summary';

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
    public selected: boolean;

    private _moneyService: MoneyService;
    private readonly transaction: ITransaction;
    private readonly editSelect: (transaction: ITransaction, clear: boolean) => void;
    private summary: ListRowSummary;
    private reconcileStatus: ListRowLineTransaction.ReconciliationStatus;
    public id: number;
    public date: Date;

    static getMonthName(month: number): string {
        switch (month) {
            case 0: {
                return 'Jan';
            }
            case 1: {
                return 'Feb';
            }
            case 2: {
                return 'Mar';
            }
            case 3: {
                return 'Apr';
            }
            case 4: {
                return 'May';
            }
            case 5: {
                return 'Jun';
            }
            case 6: {
                return 'Jul';
            }
            case 7: {
                return 'Aug';
            }
            case 8: {
                return 'Sep';
            }
            case 9: {
                return 'Oct';
            }
            case 10: {
                return 'Nov';
            }
            case 11: {
                return 'Dec';
            }
        }

        return 'Xxx';
    }

    constructor(moneyService: MoneyService,
                transaction: ITransaction,
                summary: ListRowSummary,
                editSelect: (transaction: ITransaction, clear: boolean) => void ) {
        const transactionDate: Date = new Date(transaction.date);

        this.rowType = ListRowLineType.TRANSACTION;
        this.isTotalRow = false;
        this.hasDate = true;
        this.dateDay = transactionDate.getDate().toString();
        this.dateMonth = ListRowLineTransaction.getMonthName(transactionDate.getMonth());
        this.dateYear = transactionDate.getFullYear().toString();
        this.hasAccount = true;
        this.account = transaction.account;
        this.hasCategory = true;
        this.category = transaction.category;
        this.description = transaction.description;
        this.amount = transaction.amount;
        this.amountDisplay = '?';
        this.hasButtonOne = true;
        this.hasButtonTwo = true;
        this.classButtonTwo = 'fa fa-pencil';
        this.hasButtonThree = true;
        this.classButtonThree = 'fa fa-trash';
        this.selected = false;

        // If the transaction is locked, set button one to a padlock.
        if (transaction.statement != null) {
            if (transaction.statement.locked) {
                this.setButtons(ListRowLineTransaction.ReconciliationStatus.LOCKED);
            } else {
                this.setButtons(ListRowLineTransaction.ReconciliationStatus.RECONCILED);
            }
        } else {
            this.setButtons(ListRowLineTransaction.ReconciliationStatus.UNRECONCILED);
        }

        this.transaction = transaction;
        this.summary = summary;
        this._moneyService = moneyService;
        this.editSelect = editSelect;
        this.id = transaction.id;
        this.date = transactionDate;
    }

    private setButtons(newReconcileStatus: ListRowLineTransaction.ReconciliationStatus) {
        switch (newReconcileStatus) {
            case ListRowLineTransaction.ReconciliationStatus.LOCKED:
                this.enableButtonOne = false;
                this.classButtonOne = 'fa fa-lock';
                this.enableButtonTwo = false;
                this.enableButtonThree = false;
                break;
            case ListRowLineTransaction.ReconciliationStatus.RECONCILED:
                this.enableButtonOne = true;
                this.classButtonOne = 'fa fa-times';
                this.enableButtonTwo = false;
                this.enableButtonThree = false;
                break;
            case ListRowLineTransaction.ReconciliationStatus.UNRECONCILED:
                this.enableButtonOne = true;
                this.classButtonOne = 'fa fa-check';
                this.enableButtonTwo = true;
                this.enableButtonThree = true;
                break;
        }
        this.reconcileStatus = newReconcileStatus;
    }

    select() {
    }

    clickButtonOne() {
        // If locked, do nothing.
        if (this.reconcileStatus === ListRowLineTransaction.ReconciliationStatus.LOCKED) {
            return;
        }

        // Switch the reconcile status
        if (this.reconcileStatus === ListRowLineTransaction.ReconciliationStatus.UNRECONCILED) {
            // Reconcile.
            this._moneyService.confirmTransaction(this.transaction, true);

            // Switch buttons.
            this.setButtons(ListRowLineTransaction.ReconciliationStatus.RECONCILED);
        } else {
            // Un-reconcile.
            this._moneyService.confirmTransaction(this.transaction, false);

            // Switch buttons.
            this.setButtons(ListRowLineTransaction.ReconciliationStatus.UNRECONCILED);
        }
    }

    clickButtonTwo() {
        // Only process if not reconciled.
        if (this.reconcileStatus !== ListRowLineTransaction.ReconciliationStatus.UNRECONCILED) {
            return;
        }

        // If this is already being edited, then clear it
        const newEdit: boolean = !this.selected;
        this.editSelect(this.transaction, !newEdit);
        this.selected = newEdit;
    }

    clickButtonThree() {
        // Only process if not reconciled.
        if (this.reconcileStatus !== ListRowLineTransaction.ReconciliationStatus.UNRECONCILED) {
            return;
        }

        // Delete this transaction.
        this._moneyService.deleteTransaction(this.transaction);
    }

    completeEdit(id: number, selectedCategory: ICategory, description: string, amount: number) {
        // Make sure the id matches.
        if (this.transaction.id !== id) {
            return;
        }

        if (this.transaction.category.id !== 'TRF') {
            this.transaction.category.id = selectedCategory.id;
        }

        this.transaction.description = description;
        this.transaction.amount = amount;

        // Update the transaction amount.
        this._moneyService.updateTransaction(this.transaction);
    }

    categorySelected(selectedCategory: ICategory) {
    }

    getAmount(): number {
        this.amountDisplay = this.amount.toFixed(2);
        return this.amount;
    }
}

export namespace ListRowLineTransaction {
    export enum ReconciliationStatus { LOCKED, RECONCILED, UNRECONCILED }
}
