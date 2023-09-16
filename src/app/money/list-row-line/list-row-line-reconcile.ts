import {IListRowLineInterface, ListRowLineType} from './list-row-line-interface';
import {IMatch} from '../money-match';
import {ICategory} from '../money-category';
import {ListRowLineTransaction} from './list-row-line-transaction';
import {MoneyService} from '../money.service';
import {ListRowLine} from './list-row-line';
import {Transaction} from '../money-transaction'

export class ListRowLineReconcile extends ListRowLine implements IListRowLineInterface {
    private readonly reconcile: IMatch;
    private moneyService: MoneyService;
    private readonly reconcileAction: boolean;

    constructor(moneyService: MoneyService,
                reconcile: IMatch) {
        super();

        const transactionDate: Date = new Date(reconcile.date);

        this.rowType = ListRowLineType.RECONCILE_TRANSACTION;
        this.hasDate = true;
        this.dateDay = transactionDate.getDate().toString();
        this.dateMonth = ListRowLineTransaction.getMonthName(transactionDate.getMonth());
        this.dateYear = transactionDate.getFullYear().toString();
        this.hasAccount = true;
        this.accountId = reconcile.accountId;
        this.hasCategory = true;
        this.categoryId = reconcile.categoryId;
        this.description = reconcile.description;
        this.amount = reconcile.amount;
        this.hasButtonOne = true;
        this.enableButtonOne = true;
        this.classButtonOne = 'fa fa-check';
        this.hasButtonTwo = true;
        this.enableButtonTwo = true;
        this.classButtonTwo = 'fa fa-pencil';
        this.hasButtonThree = true;
        this.enableButtonThree = true;
        this.classButtonThree = 'fa fa-trash';

        this.reconcile = reconcile;
        this.moneyService = moneyService;

        if (this.description == null) {
            if (reconcile.transaction != null) {
                this.description = reconcile.transaction.description;
            }
        }

        // Buttons depend on the forward and backward actions.
        this.reconcileAction = true;
        switch (this.reconcile.forwardAction + '-' + this.reconcile.backwardAction) {
            case 'SETCATEGORY-NONE':
                // Disable all - need to select category first.
                this.enableButtonOne = false;
                this.enableButtonTwo = false;
                this.enableButtonThree = false;
                break;

            case 'CREATE-NONE':
                // Middle button will create.
                this.enableButtonOne = false;
                this.enableButtonThree = false;
                this.classButtonTwo = 'fa fa-check';
                break;

            case 'NONE-UNRECONCILE':
                // This is a reconciled transaction - don't allow anything.
                this.enableButtonOne = false;
                this.enableButtonTwo = false;
                this.enableButtonThree = false;
                break;

            case 'UNRECONCILE-NONE':
                // This is a transaction that is not in the file.
                this.enableButtonTwo = false;
                this.enableButtonThree = false;
                this.classButtonOne = 'fa fa-times';
                this.reconcileAction = false;
                break;

            case 'RECONCILE-DELETE':
                // Button 1 tick reconcile, button 3 = trash (delete)
                this.enableButtonTwo = false;
                break;
        }
    }

    select() {
        if (this.categoryId == null || this.categoryId.startsWith('XXXX')) {
            if (!this.selected) {
                this.categoryId = 'XXXXs';
                this.selected = true;
            } else {
                this.categoryId = 'XXXXns';
                this.selected = false;
            }
        }
    }

    clickButtonOne() {
        // Reconcile or un-reconcile.
        this.moneyService.confirmTransaction(this.reconcile.transaction, this.reconcileAction);
    }

    clickButtonTwo() {
        // Always create.
        let transactions = [];
        let newTransaction = new Transaction();

        newTransaction.amount = this.reconcile.amount;
        newTransaction.date = this.reconcile.date;
        newTransaction.accountId = this.reconcile.accountId;
        newTransaction.description = this.reconcile.description;
        newTransaction.categoryId = this.reconcile.categoryId;

        transactions.push(newTransaction);

        this.moneyService.addTransaction(transactions);
    }

    clickButtonThree() {
        // Always delete
        this.moneyService.deleteTransaction(this.reconcile.transaction);
    }

    completeEdit(id: number, selectedCategory: ICategory, description: string, amount: number) {
    }

    categorySelected(selectedCategory: ICategory) {
        if (!this.selected) {
            return;
        }

        // Update the category.
        this.moneyService.setCategory(this.reconcile, selectedCategory);
        this.categoryId = selectedCategory.id;
        this.selected = false;
    }

    getAmount(): number {
        this.amountDisplay = this.amount.toFixed(2);
        return this.amount;
    }
}
