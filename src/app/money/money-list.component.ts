import {DomSanitizer} from '@angular/platform-browser';
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MoneyService, NewTransaction} from './money.service';
import {Category, ICategory} from './money-category';
import {IAccount, JbAccount} from './money-account';
import {TransactionType} from './money-type';
import {IStatement, Statement} from './money-statement';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {MoneyCategoryPickerSelectableOption} from './category-picker/money-cat-picker.component';
import {DatePipe} from '@angular/common';
import {Subject} from 'rxjs';
import {IListRowLineInterface} from './list-row-line/list-row-line-interface';
import {ListRowLineFactory} from './list-row-line/list-row-line-factory';
import {ITransaction, ListRowSummary} from './list-row-line/list-row-summary';
import {IFile} from './money-file';

export enum ListMode { Normal, Add, Regulars, Reconciliation }

export enum UpdateTransactionReason {   Type,
                                        Event,
                                        ToDate,
                                        FromDate,
                                        Account,
                                        Category,
                                        SelectAdd,
                                        SelectNormal,
                                        SelectRegular,
                                        SelectReconcilation }

@Component({
    templateUrl: './money-list.component.html',
    styleUrls: ['./money-list.component.css']
})
export class MoneyListComponent implements OnInit {
    private internalRadioType: string;
    radioAccount: string;
    types: TransactionType[];
    categories: Category[];
    accounts: JbAccount[];
    statements: Statement[];
    errorMessage: string;
    fromValue: Date = new Date();
    toValue: Date = new Date();
    summaryRow: ListRowSummary = new ListRowSummary();
    transactionsUpdated: any;
    statementsUpdated: any;
    lines: IListRowLineInterface[];
    selectedStatement: IStatement;
    files: IFile[];
    reconcileAccount: JbAccount;

    internalDate: Date = new Date();
    accountRadio: string;

    fromDateDisabled: boolean;
    toDateDisabled: boolean;

    listMode: ListMode;

    // Transaction details.
    statusMonth = 'September';
    statusYear = '2019';
    statusDay = '24';
    selectedAccount: IAccount = null;
    selectedCategory: ICategory = null;
    selectedXferAcc: IAccount = null;
    transactionAmount = 0;
    transactionDescription = '';
    existingTransactionId = -1;

    modalRef: BsModalRef;

    private lastChangeType: string;
    private lastChangeFrom: string;
    private lastChangeTo: string;

    eventsCategoriesChange: Subject<Category[]> = new Subject<Category[]>();

    @ViewChild('templateCategorySelector') categorySelector: any;

    static convertTransactionUpdateToMode(update: UpdateTransactionReason) {
        switch (update) {
            case UpdateTransactionReason.SelectAdd:
                return ListMode.Add;
            case UpdateTransactionReason.SelectNormal:
                return ListMode.Normal;
            case UpdateTransactionReason.SelectReconcilation:
                return ListMode.Reconciliation;
            case UpdateTransactionReason.SelectRegular:
                return ListMode.Regulars;
        }

        return null;
    }

    constructor(private _moneyService: MoneyService,
                public datepipe: DatePipe,
                private sanitizer: DomSanitizer,
                private modalService: BsModalService) {
        this.fromDateDisabled = true;
        this.toDateDisabled = true;
        this.lastChangeType = '';
        this.lastChangeFrom = null;
        this.lastChangeTo = null;
        this.listMode = ListMode.Normal;
        this.reconcileAccount = null;
    }

    get isAddMode() {
        return this.listMode === ListMode.Add;
    }

    selectAddMode() {
        this.updateTransactions(UpdateTransactionReason.SelectAdd);
    }

    get isNormalMode() {
        return this.listMode === ListMode.Normal;
    }

    selectNormalMode() {
        this.updateTransactions(UpdateTransactionReason.SelectNormal);
    }

    get isRegularMode() {
        return this.listMode === ListMode.Regulars;
    }

    selectRegularMode() {
        this.updateTransactions(UpdateTransactionReason.SelectRegular);
    }

    get isReconcileMode() {
        return this.listMode === ListMode.Reconciliation;
    }

    selectReconcileMode() {
        this.updateTransactions(UpdateTransactionReason.SelectReconcilation);
    }

    emitCategoriesChanged() {
        this.eventsCategoriesChange.next(this.categories);
    }

    get bsValue(): Date {
        return this.internalDate;
    }

    get transactionAmtDisplay(): string {
        if (this.transactionAmount < 0) {
            return this.transactionAmount.toFixed(2).replace('-', '-£');
        }

        return '£' + this.transactionAmount.toFixed(2);
    }

    get transactionValid(): boolean {
        if (this.internalDate == null) {
            return false;
        }

        if (this.transactionAmount === 0) {
            return false;
        }

        if (this.selectedAccount == null) {
            return false;
        }

        if (this.selectedCategory == null && this.selectedXferAcc == null ) {
            return false;
        }

        if (this.selectedXferAcc != null) {
            if (this.selectedXferAcc.id === this.selectedAccount.id) {
                return false;
            }
        }

        return true;
    }

    get statusClass(): string {
        if (!this.transactionValid) {
            return 'card text-black status-text-error mb-3';
        }

        return 'card text-black status-text-success mb-3';
    }

    set bsValue(newValue: Date) {
        if (newValue == null) {
            return;
        }
        this.internalDate = newValue;
    }

    get radioType(): string {
        return this.internalRadioType;
    }

    set radioType(typeMode: string) {
        let selectAllAccounts = true;

        // Enable/Disable date buttons.
        switch (typeMode) {
            case 'UN': {
                this.fromDateDisabled = true;
                this.toDateDisabled = true;
                break;
            }
            case 'RC': {
                this.fromDateDisabled = false;
                this.toDateDisabled = true;
                selectAllAccounts = false;
                break;
            }
            case 'AL': {
                this.fromDateDisabled = false;
                this.toDateDisabled = false;
                break;
            }
            case 'UL': {
                this.fromDateDisabled = true;
                this.toDateDisabled = true;
                break;
            }
        }

        // Set dates to MTD
        this.onDateButton('MTD');

        // Select all accounts or 1
        if (selectAllAccounts) {
            this.accounts.forEach(value => {
                value.selected = true;
            });
        } else {
            this.accounts.forEach(value => {
                value.selected = false;
            });
            if (this.accounts.length > 0) {
                this.accounts[0].selected = true;
            }
        }

        // Select all categories.
        this.categories.forEach( value => {
            value.selected = true;
        });

        this.internalRadioType = typeMode;

        this.updateTransactions(UpdateTransactionReason.Type);
    }

    get toDateButtonDisabled(): boolean {
        return this.fromDateDisabled;
    }

    get dateButtonsDisabled(): boolean {
        return this.fromDateDisabled;
    }

    ngOnInit(): void {
        this._moneyService.getTransactionTypes().subscribe(
            types => {
                this.types = types;
            },
            error => this.errorMessage = <any>error
        );
        this._moneyService.getCatories().subscribe(
            categories => {
                this.categories = categories;
            },
            error => this.errorMessage = <any>error,
            () => {
                this.categories.forEach(value => {
                    value.selected = true;
                });
                this.emitCategoriesChanged();
            }
        );
        this._moneyService.getAccounts().subscribe(
            accounts => {
                this.accounts = accounts;
            },
            error => this.errorMessage = <any>error,
            () => {
                this.accounts.forEach(value => {
                    value.selected = true;
                });
            }
        );
        this._moneyService.getStatements().subscribe(
            statements => {
                this.statements = statements;
            },
            error => this.errorMessage = <any>error
        );
        this._moneyService.getFiles().subscribe(
            files => {
                this.files = files;
            },
            error => this.errorMessage = <any>error
        );

        this.transactionsUpdated = this._moneyService.getTransactionChangeEmitter()
            .subscribe(() => this.updateTransactions(UpdateTransactionReason.Event));

        this.statementsUpdated = this._moneyService.getStatementChangeEmitter()
            .subscribe(() => this.statements = []);

        this.performDataChange(new Date());
    }

    private getTransactionType(id: string): TransactionType {
        let result: TransactionType = null;

        if (this.types != null) {
            this.types.forEach(value => {
                if (value.id === id) {
                    result = value;
                }
            });
        }

        return result;
    }

    calculateBF() {
        this.summaryRow.boughtForward = 0;

        // For unreconciled and all, set bought forward to 0
        if (this.radioType === 'UN' || this.radioType === 'AL') {
            return;
        }

        if ( !(this.statements && this.statements.length) || !(this.accounts && this.accounts.length)) {
            return;
        }

        let BF = 0;

        // For reconciled the bought forward comes from the current statement for the selected account.
        if (this.radioType === 'RC') {
            if (this.selectedStatement != null) {
                BF = this.selectedStatement.openBalance;
            }
        }

        // For not locked the bought forward is from unlocked statements of current accounts.
        if (this.radioType === 'UL') {
            this.statements.forEach(value => {
                if (!value.locked) {
                    this.accounts.forEach(account => {
                        if (account.selected && account.id === value.id.account.id) {
                            BF += value.openBalance;
                        }
                    });
                }
            });
        }

        this.summaryRow.boughtForward = BF;
    }

    updateTransactions(thisChange: UpdateTransactionReason) {
        if (thisChange === UpdateTransactionReason.SelectAdd || thisChange === UpdateTransactionReason.SelectNormal) {
            if (this.listMode === ListMode.Normal || this.listMode === ListMode.Add) {
                this.listMode = MoneyListComponent.convertTransactionUpdateToMode(thisChange);
                return;
            }

            this.listMode = MoneyListComponent.convertTransactionUpdateToMode(thisChange);
        }

        if (thisChange === UpdateTransactionReason.SelectReconcilation) {
            if (this.listMode === ListMode.Reconciliation) {
                return;
            }

            this.listMode = ListMode.Reconciliation;
        }

        if (thisChange === UpdateTransactionReason.SelectRegular) {
            if (this.listMode === ListMode.Regulars) {
                return;
            }

            this.listMode = ListMode.Regulars;
        }

        if (thisChange === UpdateTransactionReason.ToDate) {
            if (this.lastChangeFrom === this.fromValue.toISOString()) {
                console.log('Date From Change already reflected.');
                return;
            }
        } else if (thisChange === UpdateTransactionReason.FromDate) {
            if (this.lastChangeFrom === this.fromValue.toISOString() ) {
                console.log('Date To Change already reflected.');
                return;
            }
        } else if (thisChange === UpdateTransactionReason.Type) {
            if (this.lastChangeType === this.internalRadioType) {
                console.log('Date Change already reflected.');
                return;
            }
        }

        // If the statements are empty, request them
        if (this.statements == null || this.statements.length === 0) {
            this._moneyService.getStatements().subscribe(
                statements => {
                    this.statements = statements;
                },
                error => this.errorMessage = <any>error,
                () => {
                    console.log('Statement request complete.');
                }
            );
        }

        // Set the selected statement.
        this.selectedStatement = null;
        if (this.radioType === 'RC') {
            this.accounts.forEach(account => {
                if (account.selected) {
                    this.statements.forEach( statement => {
                        if ( (statement.id.account.id === account.id) &&
                            (statement.id.year === this.fromValue.getFullYear()) &&
                            (statement.id.month === this.fromValue.getMonth() + 1 )) {
                            this.selectedStatement = statement;
                        }
                    });
                }
            });
        }

        if (this.listMode === ListMode.Normal || this.listMode === ListMode.Add) {
            this.lastChangeType = this.internalRadioType;
            this.lastChangeTo = this.toValue.toISOString();
            this.lastChangeFrom = this.fromValue.toISOString();

            this.calculateBF();
            this.summaryRow.resetCreditsDetbits();
            this.lines = [];
            this.lines.push(ListRowLineFactory.createRowLineTotalBfwd(this.summaryRow));
            this.lines.push(ListRowLineFactory.createRowLineDebits(this.summaryRow));
            this.lines.push(ListRowLineFactory.createRowLineCredits(this.summaryRow));
            this.lines.push(ListRowLineFactory.createRowLineTotalCfwd(this._moneyService, this.summaryRow, this.selectedStatement));
            this._moneyService.getTransactions(this.getTransactionType(this.internalRadioType),
                this.fromValue,
                this.toValue,
                this.accounts,
                this.categories).subscribe(
                transactions => {
                    transactions.forEach(value => {
                        this.lines.push(ListRowLineFactory.createRowLineTransaction(
                            this._moneyService,
                            value,
                            this.summaryRow,
                            (transaction: ITransaction, clear: boolean ) => {
                                if (clear) {
                                    this.onClearEdit();
                                    return;
                                }

                                console.log('Edit - ' + transaction.id);

                                this.existingTransactionId = transaction.id;
                                this.transactionDescription = transaction.description;
                                this.transactionAmount = transaction.amount;

                                this.categories.forEach(nextCategory => {
                                    if (nextCategory.id === transaction.category.id) {
                                        this.selectedCategory = nextCategory;
                                    }
                                });

                                this.accounts.forEach(nextAccount => {
                                    if (nextAccount.id === transaction.account.id) {
                                        this.selectedAccount = nextAccount;
                                    }
                                });

                                this.performDataChange(transaction.date);

                                this.lines.forEach(value2 => { value2.selected = false; });
                        }));
                        this.summaryRow.addAmount(value.amount);
                    });
                },
                error => this.errorMessage = <any>error,
                () => {
                    console.log('Request Transactions Complete.' + thisChange);
                }
            );
        } else if (this.listMode === ListMode.Regulars) {
            // Get the regulars.
            this.lines = [];
            this._moneyService.getRegularPayments().subscribe(
                transctions => {
                    transctions.forEach( value => {
                        this.lines.push(ListRowLineFactory.createRowLineRegular(value));
                    });
                },
                error => this.errorMessage = <any>error,
                () => {
                    console.log('Request Regular Transactions Complete.');
                }
            );
        } else if (this.listMode === ListMode.Reconciliation) {
            // Get the reconcilation.
            this.lines = [];
            this.lines.push(ListRowLineFactory.createRowLineReconcileTop(this._moneyService, () => {
                // Perform the category update (only if some are selected).
                let anySelected = false;
                this.lines.forEach(value => {
                    if (value.selected) {
                        anySelected = true;
                    }
                });

                if (anySelected) {
                    this.openModal(this.categorySelector, '');
                }
            }));

            if (this.reconcileAccount != null) {
                this._moneyService.getMatches(this.reconcileAccount).subscribe(
                    matches => {
                        matches.forEach(value => {
                            this.lines.push(ListRowLineFactory.createRowLineReconcile(this._moneyService, value));
                        });
                    },
                    error => this.errorMessage = <any>error,
                    () => {
                        console.log('Request matches Complete.');
                    }
                );
            }
        }
    }

    onDateChangeFrom(newDate: Date): void {
        this.fromValue = newDate;
        this.updateTransactions(UpdateTransactionReason.FromDate);
    }

    onDateChangeTo(newDate: Date): void {
        this.toValue = newDate;
        this.updateTransactions(UpdateTransactionReason.ToDate);
    }

    onDateButton(btn: string) {
        // YTD, MTD, M+1 M-1 Y+1 Y-1
        switch (btn) {
            case 'MTD': {
                const today: Date = new Date();
                if (today.getDate() === 1) {
                    let month = today.getMonth() - 1;
                    let year = today.getFullYear();
                    if (month < 0) {
                        month = 12;
                        year -= 1;
                    }
                    this.fromValue = new Date(year, month, 1);
                    this.toValue = today;
                } else {
                    this.fromValue = new Date(today.getFullYear(), today.getMonth(), 1);
                    this.toValue = today;
                }
                break;
            }
            case 'M+1': {
                let month = this.fromValue.getMonth();
                let year = this.fromValue.getFullYear();
                month += 1;

                if (month > 11) {
                    month = 0;
                    year += 1;
                }

                this.fromValue = new Date(year, month, 1);
                this.toValue = new Date(this.fromValue.getFullYear(), this.fromValue.getMonth() + 1, 0);
                break;
            }
            case 'M-1': {
                let month = this.fromValue.getMonth();
                let year = this.fromValue.getFullYear();
                month -= 1;

                if (month < 0) {
                    month = 11;
                    year -= 1;
                }

                this.fromValue = new Date(year, month, 1);
                this.toValue = new Date(this.fromValue.getFullYear(), this.fromValue.getMonth() + 1, 0);
                break;
            }
            case 'YTD': {
                const today: Date = new Date();
                this.fromValue = new Date(today.getFullYear(), 0, 1);
                this.toValue = today;
                break;
            }
            case 'Y-1': {
                this.fromValue = new Date(this.fromValue.getFullYear() - 1, 0, 1);
                this.toValue = new Date(this.fromValue.getFullYear() + 1, 0, 0);
                break;
            }
            case 'Y+1': {
                this.fromValue = new Date(this.fromValue.getFullYear() + 1, 0,  1);
                this.toValue = new Date(this.fromValue.getFullYear() + 1, 0, 0);
                break;
            }
        }

    }

    onAccountClick(account: JbAccount): void {
        // If reconciled, only 1 account can be selected.
        if (this.radioType === 'RC') {
            this.accounts.forEach(value => {
                value.selected = false;
            });
            account.selected = true;
        } else {
            account.selected = !account.selected;
        }

        this.updateTransactions(UpdateTransactionReason.Account);
    }

    onLoadRecForAccount(file: IFile, account: JbAccount) {
        this.reconcileAccount = account;
        this._moneyService.loadFileRequest(file, account);
    }

    getAccountColour(index: number): string {
        if (index < this.accounts.length) {
            return '#' + this.accounts[index].colour;
        }

        return '#FFFFFF';
    }

    getImage(account: JbAccount): string {
        if (account.selected) {
            return MoneyService.getAccountImage(account.id);
        }

        return MoneyService.getDisabledAccountImage(account.id);
    }

    getSelectedImage(account: JbAccount): string {
        return MoneyService.getAccountImage(account.id);
    }

    getAccountImage(id: string): string {
        return MoneyService.getAccountImage(id);
    }

    getSelectedAcountColour(): string {
        if (this.selectedAccount != null) {
            return '#' + this.selectedAccount.colour;
        }

        return '#3277A8';
    }

    getSelectedCategoryColour(): string {
        if (this.selectedCategory != null) {
            return '#' + this.selectedCategory.colour;
        }

        return '#3277A8';
    }

    getSelectedCategoryText(): string {
        if (this.selectedCategory != null) {
            return this.selectedCategory.name;
        }

        return '?';
    }

    performDataChange(newDate: Date): void {
        // tslint:disable-next-line:no-console
        console.info('Date Changed ' + (newDate == null ? 'is null ' : 'not'));
        this.bsValue = newDate;

        this.statusMonth = this.datepipe.transform(this.bsValue, 'MMMM');
        this.statusDay = this.datepipe.transform(this.bsValue, 'd');
        this.statusYear = this.datepipe.transform(this.bsValue, 'yyyy');
    }

    onDateChange(newDate: Date): void {
        this.performDataChange(newDate);
        this.modalRef.hide();
    }

    onClickAccount(id: string): void {
        this.selectedAccount = null;

        this.accounts.forEach(nextAccount => {
            if (nextAccount.id === id) {
                this.selectedAccount = nextAccount;
            }
        });

        this.modalRef.hide();
    }

    onAmountEntered(value: number) {
        // tslint:disable-next-line:no-console
        console.info('Entered = ' + value);

        this.transactionAmount = value;

        this.modalRef.hide();
    }

    openModal(template: TemplateRef<any>, dialogClass: string) {
        this.modalRef = this.modalService.show(template, {class: dialogClass});
    }

    onExitFilter() {
        this.modalRef.hide();
    }

    onCategorySelected(value: MoneyCategoryPickerSelectableOption) {
        this.selectedCategory = null;
        this.selectedXferAcc = null;

        if (value.accountTransfer != null) {
            this.selectedXferAcc = value.accountTransfer;
        } else {
            this.selectedCategory = value.category;
        }

        this.modalRef.hide();
    }

    onCategorySelector(selection: MoneyCategoryPickerSelectableOption) {
        // Update the category on all selected items.
        this.lines.forEach(value => {
            value.categorySelected(selection.category);
        });

        this.modalRef.hide();
    }

    onExitSelector() {
        this.modalRef.hide();
    }

    onCategoryFiltered() {
        this.updateTransactions(UpdateTransactionReason.Category);
        this.emitCategoriesChanged();
    }

    onClearEdit() {
        this.transactionDescription = '';
        this.transactionAmount = 0;
        this.selectedAccount = null;
        this.selectedCategory = null;
        this.existingTransactionId = -1;
        this.lines.forEach(value => { value.selected = false; });
    }

    onClickCreate() {
        // tslint:disable-next-line:no-console
        console.info('Create transaction:');

        if (this.transactionValid) {
            if (this.existingTransactionId !== -1) {
                // Find the transaction in the list, and update it.
                this.lines.forEach(nextLine => {
                    if (nextLine.selected) {
                        nextLine.completeEdit (
                            this.existingTransactionId,
                            this.selectedCategory,
                            this.transactionDescription,
                            this.transactionAmount );

                        // Recalculate the totals.
                        this.summaryRow.resetCreditsDetbits();
                        this.lines.forEach(value => {
                            this.summaryRow.addAmount(value.amount);
                        });
                    }
                });
            } else {
                const newTransaction: NewTransaction = new NewTransaction();
                newTransaction.amount = this.transactionAmount;
                newTransaction.date = this.internalDate;
                newTransaction.accountId = this.selectedAccount.id;
                newTransaction.description = this.transactionDescription;
                if (this.selectedXferAcc != null) {
                    newTransaction.accountTransfer = true;
                    newTransaction.transferAccountId = this.selectedXferAcc.id;
                    newTransaction.categoryId = 'TRF';
                } else {
                    newTransaction.accountTransfer = false;
                    newTransaction.categoryId = this.selectedCategory.id;
                }

                this._moneyService.addTransaction(newTransaction);
            }
        }

        // Clear the details.
        this.onClearEdit();
    }
}
