import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Component, OnInit, TemplateRef} from "@angular/core";
import {MoneyService} from "./money.service";
import {Category, ICategory} from "./money-category";
import {JbAccount} from "./money-account";
import {TransactionType} from "./money-type";
import {ITransaction, Transaction, TransactionLineType, TransactionSummary} from "./money-transaction";
import {Statement} from "./money-statement";
import {BsModalService,BsModalRef} from "ngx-bootstrap/modal";

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

    fromDateDisabled: boolean;
    toDateDisabled: boolean;

    private lastChangeType: string;
    private lastChangeFrom: string;
    private lastChangeTo: string;

    private readonly categoryImageTemplate: string;

    modalRef: BsModalRef;

    constructor(private _moneyService : MoneyService,
                private sanitizer: DomSanitizer,
                private modalService: BsModalService) {
        this.fromDateDisabled = true;
        this.toDateDisabled = true;
        this.lastChangeType = "";
        this.lastChangeFrom = null;
        this.lastChangeTo = null;
        this.selectedStatement = null;

        // Setup the template for the category image.
        this.categoryImageTemplate = "<svg ##viewbox## width='98%' height='98%'>".replace("##viewbox##","viewBox='0 0 100 100'");
        this.categoryImageTemplate += "<circle cx='50' cy='50' r='48' style='stroke:#006600; fill:###colour##'/>";
        this.categoryImageTemplate += "</svg>"
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
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
    }

    get filteredCatgories() : Category[] {
        return this.categories.filter((category: ICategory) =>
            category.systemUse == "N")
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

    onCategoryClick(category: Category):void {
        category.selected = !category.selected;

        this.updateTransactions("category");
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

    getAccountImage(accountId: string) {
        return MoneyService.getAccountImage(accountId);
    }

    getCategoryImage(transaction: ITransaction) : SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(this.categoryImageTemplate.replace("##colour##",transaction.catColour));
    }

    getCategoryColour(index: number) : string {
        if(index < this.categories.length)
        {
            return "#" + this.categories[index].colour;
        }

        return "#FFFFFF";
    }

    clickEditable(transaction: Transaction) {
        console.log("Edit - " + transaction.editable);

        if(transaction.editable) {
            transaction.editable = false;
            return;
        }

        this.transactions.forEach(value => { value.editable = false; });

        transaction.editable = true;
    }

    onEnter(transaction: Transaction) {
        transaction.editable = false;

        // Update the transaction amount.
        this._moneyService.updateTransaction(transaction);

        // Recalculate the totals.
        this.summaryRow.resetCreditsDetbits();
        this.transactions.forEach(value => {
            this.summaryRow.addAmount(value.amount);
        });
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
}
