import {DomSanitizer} from '@angular/platform-browser';
import {Component, OnInit, TemplateRef} from "@angular/core";
import {MoneyService, NewTransaction} from "./money.service";
import {Category, ICategory} from "./money-category";
import {IAccount, JbAccount} from "./money-account";
import {TransactionType} from "./money-type";
import {Transaction, TransactionLineType, TransactionSummary} from "./money-transaction";
import {Statement} from "./money-statement";
import {BsModalService,BsModalRef} from "ngx-bootstrap/modal";
import {MoneyCategoryPickerSelectableOption} from "./category-picker/money-cat-picker.component";
import {DatePipe} from "@angular/common";
import {Subject} from "rxjs";

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
    transactions: Transaction[];
    statements: Statement[];
    errorMessage: string;
    fromValue: Date = new Date();
    toValue: Date = new Date();
    summaryRow: TransactionSummary = new TransactionSummary();
    selectedStatement: Statement;
    transactionsUpdated: any;

    internalDate: Date = new Date();
    accountRadio: string;

    fromDateDisabled: boolean;
    toDateDisabled: boolean;

    isCollapsed: boolean;

    // Transaction details.
    statusMonth: string = 'September';
    statusYear: string = '2019';
    statusDay: string = '24';
    selectedAccount: IAccount = null;
    selectedCategory: ICategory = null;
    selectedXferAcc: IAccount = null;
    transactionAmount: number = 0;
    transactionDescription: string = "";
    existingTransactionId: number = -1;

    modalRef: BsModalRef;

    private lastChangeType: string;
    private lastChangeFrom: string;
    private lastChangeTo: string;

    eventsCategoriesChange: Subject<Category[]> = new Subject<Category[]>();

    constructor(private _moneyService : MoneyService,
                public datepipe: DatePipe,
                private sanitizer: DomSanitizer,
                private modalService: BsModalService) {
        this.fromDateDisabled = true;
        this.toDateDisabled = true;
        this.lastChangeType = "";
        this.lastChangeFrom = null;
        this.lastChangeTo = null;
        this.selectedStatement = null;
        this.isCollapsed = true;
    }

    emitCategoriesChanged() {
        this.eventsCategoriesChange.next(this.categories);
    }

    get bsValue(): Date {
        return this.internalDate;
    }

    get transactionAmtDisplay() : string {
        if (this.transactionAmount < 0)
            return this.transactionAmount.toFixed(2).replace("-","-£");

        return "£" + this.transactionAmount.toFixed(2);
    }

    get transactionValid() : boolean {
        if(this.internalDate == null) {
            return false;
        }

        if(this.transactionAmount == 0) {
            return false;
        }

        if(this.selectedAccount == null) {
            return false;
        }

        if(this.selectedCategory == null && this.selectedXferAcc == null ) {
            return false;
        }

        if(this.selectedXferAcc != null) {
            if(this.selectedXferAcc.id == this.selectedAccount.id) {
                return false;
            }
        }

        return true;
    }

    get statusClass(): string {
        if(!this.transactionValid) {
            return "card text-black status-text-error mb-3";
        }

        return "card text-black status-text-success mb-3";
    }

    set bsValue(newValue: Date) {
        if(newValue == null)
            return;
        this.internalDate = newValue;
    }

    get radioType() : string {
        return this.internalRadioType;
    }

    set radioType(value: string) {
        let selectAllAccounts: boolean = true;

        // Enable/Disable date buttons.
        switch(value) {
            case "UN": {
                this.fromDateDisabled = true;
                this.toDateDisabled = true;
                break;
            }
            case "RC": {
                this.fromDateDisabled = false;
                this.toDateDisabled = true;
                selectAllAccounts = false;
                break;
            }
            case "AL": {
                this.fromDateDisabled = false;
                this.toDateDisabled = false;
                break;
            }
            case "UL": {
                this.fromDateDisabled = true;
                this.toDateDisabled = true;
                break;
            }
        }

        // Set dates to MTD
        this.onDateButton('MTD');


        // Select all accounts or 1
        if(selectAllAccounts) {
            this.accounts.forEach(value => {
                value.selected = true;
            })
        } else {
            this.accounts.forEach(value => {
                value.selected = false;
            });
            if(this.accounts.length > 0) {
                this.accounts[0].selected = true;
            }
        }

        // Select all categories.
        this.categories.forEach( value => {
            value.selected = true;
        });

        this.internalRadioType = value;

        this.updateTransactions("type");
    }

    get toDateButtonDisabled() : boolean {
        return this.fromDateDisabled;
    }

    get dateButtonsDisabled() : boolean {
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
                })
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
                })
            }
        );
        this._moneyService.getStatements().subscribe(
            statements => {
                this.statements = statements;
            },
            error => this.errorMessage = <any>error
        );

        this.transactionsUpdated = this._moneyService.getTransactionChangeEmitter()
            .subscribe(() => this.updateTransactions("Event"));

        this.performDataChange(new Date());
    }

    get filteredCatgories() : Category[] {
        return this.categories.filter((category: ICategory) =>
            !category.systemUse)
    }

    private getTransactionType(id: string) : TransactionType {
        let result: TransactionType = null;

        if(this.types != null) {
            this.types.forEach(value => {
                if (value.id == id) {
                    result = value;
                }
            });
        }

        return result;
    }

    calculateBF() {
        this.summaryRow.boughtForward = 0;

        // For unreconciled and all, set bought forward to 0
        if(this.radioType == "UN" || this.radioType == "AL") {
            return;
        }

        if( !(this.statements && this.statements.length) || !(this.accounts && this.accounts.length)) {
            return;
        }

        let BF: number = 0;

        // For reconciled the bought forward comes from the current statement for the selected account.
        if(this.radioType == "RC") {
            if(this.selectedStatement != null) {
                BF = this.selectedStatement.openBalance;
            }
        }

        // For not locked the bought forward is from unlocked statements of current accounts.
        if(this.radioType == "UL") {
            this.statements.forEach(value => {
                if (!value.locked) {
                    this.accounts.forEach(account => {
                        if (account.selected && account.id == value.account) {
                            BF += value.openBalance;
                        }
                    });
                }
            })
        }

        this.summaryRow.boughtForward = BF;
    }

    updateTransactions(thisChange: string) {
        if(thisChange == "todate")
        {
            if(this.lastChangeFrom == this.fromValue.toISOString()) {
                console.log("Date From Change already reflected.");
                return;
            }
        }
        else if(thisChange == "fromdate")
        {
            if(this.lastChangeFrom == this.fromValue.toISOString() ) {
                console.log("Date To Change already reflected.");
                return;
            }
        }
        else if(thisChange == "type")
        {
            if(this.lastChangeType == this.internalRadioType)
            {
                console.log("Date Change already reflected.");
                return;
            }
        }

        // If the statements are empty, request them
        if(this.statements == null || this.statements.length == 0)
        {
            this._moneyService.getStatements().subscribe(
                statements => {
                    this.statements = statements;
                },
                error => this.errorMessage = <any>error,
                () => {
                    console.log("Statement request complete.");
                }
            )
        }

        // Set the selected statement.
        this.summaryRow.canLock = false;
        this.selectedStatement = null;
        let statementId = MoneyService.getStatementId(this.fromValue);
        if(this.radioType == "RC") {
            this.accounts.forEach(account => {
                if(account.selected) {
                    this.statements.forEach( statement => {
                        if( (statement.account == account.id) && (statement.yearMonthId == statementId)) {
                            this.selectedStatement = statement;
                            this.summaryRow.canLock = true;
                        }
                    });
                }
            });
        }

        this.lastChangeType = this.internalRadioType;
        this.lastChangeTo = this.toValue.toISOString();
        this.lastChangeFrom = this.fromValue.toISOString();

        this.calculateBF();
        this.summaryRow.resetCreditsDetbits();
        this.transactions = [];
        this._moneyService.getTransactions(this.getTransactionType(this.internalRadioType),
            this.fromValue,
            this.toValue,
            this.accounts,
            this.categories).subscribe(
            transactions => {
                transactions.forEach(value => {
                    this.transactions.push(new Transaction(value,this.summaryRow,TransactionLineType.TRANSACTION));
                    this.summaryRow.addAmount(value.amount);
                })
            },
            error => this.errorMessage = <any>error,
            () => {
                console.log("Request Transactions Complete." + thisChange);
                this.transactions.push(new Transaction(null,this.summaryRow,TransactionLineType.TOTAL_BOUGHTFWD));
                this.transactions.push(new Transaction(null,this.summaryRow,TransactionLineType.TOTAL_DEBITS));
                this.transactions.push(new Transaction(null,this.summaryRow,TransactionLineType.TOTAL_CREDITS));
                this.transactions.push(new Transaction(null,this.summaryRow,TransactionLineType.TOTAL_CARRIEDFWD));
            }
        )
    }

    onClickLockStatement() {
        if(this.selectedStatement != null && !this.selectedStatement.locked) {
            this._moneyService.lockStatement(this.selectedStatement);
            this.transactions = [];
            this.statements = [];
            this.selectedStatement = null;
        }
    }

    onDateChangeFrom(newDate: Date): void {
        this.fromValue = newDate;
        this.updateTransactions("fromdate");
    }

    onDateChangeTo(newDate: Date): void {
        this.toValue = newDate;
        this.updateTransactions("todate");
    }

    onDateButton(btn: string) {
        // YTD, MTD, M+1 M-1 Y+1 Y-1
        switch(btn) {
            case "MTD": {
                let today: Date = new Date();
                if(today.getDate() == 1) {
                    let month = today.getMonth() - 1;
                    let year = today.getFullYear();
                    if(month < 0) {
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

                if(month > 11)
                {
                    month = 0;
                    year += 1;
                }

                this.fromValue = new Date(year,month,1);
                this.toValue = new Date(this.fromValue.getFullYear(),this.fromValue.getMonth() + 1,0);
                break;
            }
            case 'M-1': {
                let month = this.fromValue.getMonth();
                let year = this.fromValue.getFullYear();
                month -= 1;

                if(month < 0)
                {
                    month = 11;
                    year -= 1;
                }

                this.fromValue = new Date(year,month,1);
                this.toValue = new Date(this.fromValue.getFullYear(),this.fromValue.getMonth() + 1,0);
                break;
            }
            case "YTD": {
                let today: Date = new Date();
                this.fromValue = new Date(today.getFullYear(),0,1);
                this.toValue = today;
                break;
            }
            case 'Y-1': {
                this.fromValue = new Date(this.fromValue.getFullYear()-1,0, 1);
                this.toValue = new Date(this.fromValue.getFullYear()+1,0,0);
                break;
            }
            case 'Y+1': {
                this.fromValue = new Date(this.fromValue.getFullYear()+1,0, 1);
                this.toValue = new Date(this.fromValue.getFullYear()+1,0,0);
                break;
            }
        }

    }

    onAccountClick(account: JbAccount): void {
        // If reconciled, only 1 account can be selected.
        if(this.radioType == "RC") {
            this.accounts.forEach(value => {
                value.selected = false;
            });
            account.selected = true;
        } else {
            account.selected = !account.selected;
        }

        this.updateTransactions("account");
    }

    getAccountColour(index: number) : string {
        if(index < this.accounts.length)
        {
            return "#" + this.accounts[index].colour;
        }

        return "#FFFFFF";
    }

    getImage(account: JbAccount): string {
        if(account.selected) {
            return MoneyService.getAccountImage(account.id);
        }

        return MoneyService.getDisabledAccountImage(account.id);
    }

    clickEditable(transaction: Transaction) {
        console.log("Edit - " + transaction.editable);

        this.existingTransactionId = transaction.id;
        this.transactionDescription = transaction.description;
        this.transactionAmount = transaction.amount;

        this.categories.forEach(nextCategory => {
            if(nextCategory.id == transaction.categoryId) {
                this.selectedCategory = nextCategory;
            }
        });

        this.accounts.forEach(nextAccount => {
            if(nextAccount.id == transaction.account) {
                this.selectedAccount = nextAccount;
            }
        });

        this.performDataChange(transaction.date);

        if(transaction.editable) {
            transaction.editable = false;
            return;
        }

        this.transactions.forEach(value => { value.editable = false; });

        transaction.editable = true;
    }

    confirmTransaction(transaction:Transaction) {
        // Confirm or unconfirm a tranaction.
        this._moneyService.confirmTransaction(transaction);
        this.transactions = [];
    }

    deleteTransaction(transaction:Transaction) {
        // Delete the transaction.
        this._moneyService.deleteTransaction(transaction);
        this.transactions = [];
    }



    getAccountImage(id: string): string {
        return MoneyService.getAccountImage(id);
    }

    getSelectedAcountColour() : string {
        if(this.selectedAccount != null) {
            return "#" + this.selectedAccount.colour;
        }

        return "#3277A8";
    }

    getSelectedCategoryColour() : string {
        if(this.selectedCategory != null) {
            return "#" + this.selectedCategory.colour;
        }

        return "#3277A8";
    }

    getSelectedCategoryText() : string {
        if(this.selectedCategory != null) {
            return this.selectedCategory.name;
        }

        return "?";
    }

    performDataChange(newDate: Date): void {
        console.info("Date Changed " + (newDate == null ? "is null " : "not"));
        this.bsValue = newDate;

        this.statusMonth = this.datepipe.transform(this.bsValue,'MMMM');
        this.statusDay = this.datepipe.transform(this.bsValue,'d');
        this.statusYear = this.datepipe.transform(this.bsValue,'yyyy');
    }

    onDateChange(newDate: Date): void {
        this.performDataChange(newDate);
        this.modalRef.hide();
    }

    onClickAccount(id: string): void {
        this.selectedAccount = null;

        this.accounts.forEach(nextAccount => {
            if(nextAccount.id == id) {
                this.selectedAccount = nextAccount;
            }
        });

        this.modalRef.hide();
    }

    onAmountEntered(value: number){
        console.info("Entered = " + value);

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

        if(value.accountTransfer != null) {
            this.selectedXferAcc = value.accountTransfer;
        } else {
            this.selectedCategory = value.category;
        }

        this.modalRef.hide();
    }

    onCategoryFiltered(value: MoneyCategoryPickerSelectableOption) {
        this.updateTransactions("category");
        this.emitCategoriesChanged();
    }

    onClearEdit() {
        this.transactionDescription = "";
        this.transactionAmount = 0;
        this.selectedAccount = null;
        this.selectedCategory = null;
        this.existingTransactionId = -1;
    }

    onClickCreate() {
        console.info("Create transaction:");

        if(this.transactionValid) {
            if(this.existingTransactionId != -1) {
                // Find the transaction in the list, and update it.
                this.transactions.forEach(nextTransaction => {
                    if(nextTransaction.id == this.existingTransactionId) {
                        if (nextTransaction.categoryId != "TRF") {
                            nextTransaction.categoryId = this.selectedCategory.id;
                        }

                        nextTransaction.description = this.transactionDescription;
                        nextTransaction.amount = this.transactionAmount;

                        // Update the transaction amount.
                        this._moneyService.updateTransaction(nextTransaction);

                        // Recalculate the totals.
                        this.summaryRow.resetCreditsDetbits();
                        this.transactions.forEach(value => {
                            this.summaryRow.addAmount(value.amount);
                        });
                    }
                })
            } else {
                let newTransaction: NewTransaction = new NewTransaction();
                newTransaction.amount = this.transactionAmount;
                newTransaction.date = this.internalDate;
                newTransaction.account = this.selectedAccount.id;
                newTransaction.description = this.transactionDescription;
                if (this.selectedXferAcc != null) {
                    newTransaction.accountTransfer = true;
                    newTransaction.transferAccount = this.selectedXferAcc.id;
                    newTransaction.category = "TRF";
                } else {
                    newTransaction.accountTransfer = false;
                    newTransaction.category = this.selectedCategory.id;
                }

                this._moneyService.addTransaction(newTransaction);
            }
        }

        // Clear the details.
        this.onClearEdit();
    }
}
