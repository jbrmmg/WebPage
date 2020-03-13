import {IRegular} from "./money-regular";
import {IAccount} from "./money-account";
import {Category, ICategory} from "./money-category";
import {IStatement} from "./money-statement";
import {IMatch} from "./money-match";

export interface ITransaction {
    id: number;
    account: IAccount;
    category: ICategory;
    date: Date;
    amount: number;
    statement: IStatement;
    description: string;
    oppositeTransactionId: number;
}

export interface IExtendedTransaction {
}

export enum TransactionLineType {
    TRANSACTION,
    TOTAL_BOUGHTFWD,
    TOTAL_DEBITS,
    TOTAL_CREDITS,
    TOTAL_CARRIEDFWD,
    REGULAR_TRANSACTION,
    RECONCILE_TRANSACTION,
    RECONCILE_TOP_LINE
}

export class Transaction implements ITransaction, IExtendedTransaction {
    id: number = -1;
    temp: number = -1;
    account: IAccount = null;
    category: ICategory = null;
    date: Date = null;
    amount: number = 0.0;
    statement: IStatement = null;
    oppositeTransactionId: number = -1;
    editable: boolean = false;
    transactionLineType: TransactionLineType = TransactionLineType.TRANSACTION;
    summary: TransactionSummary = null;
    description: string = "";
    reconciled: boolean;

    static unknownCategory: ICategory;
    static selectedCategory: ICategory;

    private static createUiCategories() {
        if(Transaction.unknownCategory == null) {
            Transaction.unknownCategory = new Category("XXXXX", "Not Set", 0, false, "000000", "none", false, "");
        }

        if(Transaction.selectedCategory == null) {
            Transaction.selectedCategory = new Category("XXXXX", "Selected", 0, false, "808080", "none", false, "");
        }
    }

    private static getUnknownCategory() : ICategory {
        Transaction.createUiCategories();

        return Transaction.unknownCategory;
    }

    private static getSelectedCategory() : ICategory {
        Transaction.createUiCategories();

        return Transaction.selectedCategory;
    }

    constructor(source: ITransaction,
                regular: IRegular,
                reconcile: IMatch,
                summary: TransactionSummary,
                type: TransactionLineType) {
        if(source != null) {
            this.id = source.id;
            this.account = source.account;
            this.category = source.category;
            this.date = new Date(source.date);
            this.amount = source.amount;
            this.oppositeTransactionId = source.oppositeTransactionId;
            this.description = source.description;
            this.statement = source.statement;
            this.reconciled = (this.statement != null);
        } else if(regular != null)  {
            this.id = regular.id;
            this.category = regular.category;
            this.date = regular.lastDate == null ? null :  new Date(regular.lastDate);
            this.amount = regular.amount;
            this.description = regular.description;
            this.account = regular.account;
            this.statement = null;
        } else if(reconcile != null) {
            this.id = reconcile.id;
            this.account = reconcile.account;
            this.category = reconcile.category == null ? Transaction.getUnknownCategory() : reconcile.category;
            this.date = new Date(reconcile.date);
            this.amount = reconcile.amount;
            this.description = reconcile.description;
            this.statement = null;
            this.reconciled = (reconcile.forwardAction == "UNRECONCILE") ? true : false;
        }
        this.transactionLineType = type;
        this.summary = summary;
    }

    selectCategory() {
        if(this.transactionLineType == TransactionLineType.RECONCILE_TRANSACTION) {
            if(this.category.id == "XXXXX") {
                if(this.category.name == "Selected") {
                    this.category = Transaction.getUnknownCategory();
                } else {
                    this.category = Transaction.getSelectedCategory();
                }
            }
        }
    }

    get dateDay() : string {
        if(this.date != null) {
            return this.date.getDate().toString();
        } else {
            return "";
        }
    }

    get dateMonth() : string {
        if(this.date != null) {
            switch(this.date.getMonth()) {
                case 0: {
                    return "Jan";
                }
                case 1: {
                    return "Feb";
                }
                case 2: {
                    return "Mar";
                }
                case 3: {
                    return "Apr";
                }
                case 4: {
                    return "May";
                }
                case 5: {
                    return "Jun";
                }
                case 6: {
                    return "Jul";
                }
                case 7: {
                    return "Aug";
                }
                case 8: {
                    return "Sep";
                }
                case 9: {
                    return "Oct";
                }
                case 10: {
                    return "Nov";
                }
                case 11: {
                    return "Dec";
                }
                default: {
                    return "Xxx";
                }
            }
        } else {
            return "";
        }
    }

    get dateYear() : string {
        if(this.date != null) {
            return this.date.getFullYear().toString();
        } else {
            return "";
        }
    }

    get locked() : boolean {
        if(this.transactionLineType == TransactionLineType.RECONCILE_TOP_LINE) {
            return false;
        }

        if(this.transactionLineType == TransactionLineType.REGULAR_TRANSACTION) {
            return true;
        }

        if(this.statement != null) {
            if(this.statement.locked) {
                return true;
            }
        }

        return false;
    }

    get tickOK() : boolean {
        if(this.transactionLineType == TransactionLineType.RECONCILE_TOP_LINE)
            return true;

        if(this.transactionLineType == TransactionLineType.RECONCILE_TRANSACTION) {
            if(this.reconciled) {
                return false;
            }
        }

        return !this.locked;
    }

    get pencilOK() : boolean {
        if(this.transactionLineType == TransactionLineType.RECONCILE_TOP_LINE)
            return true;

        return !(this.locked || this.reconciled);
    }

    get dustbinOK() : boolean {
        if(this.transactionLineType == TransactionLineType.RECONCILE_TOP_LINE)
            return true;

        return !(this.locked || this.reconciled);
    }

    get amountString(): string {
        return this.amount.toFixed(2);
    }

    get isTransactionLine(): boolean {
        return this.transactionLineType == TransactionLineType.TRANSACTION ||
            this.transactionLineType == TransactionLineType.REGULAR_TRANSACTION ||
            this.transactionLineType == TransactionLineType.RECONCILE_TRANSACTION ||
            this.transactionLineType == TransactionLineType.RECONCILE_TOP_LINE;
    }

    get isBoughtForward(): boolean {
        return this.transactionLineType == TransactionLineType.TOTAL_BOUGHTFWD;
    }

    get isTotalDebits(): boolean {
        return this.transactionLineType == TransactionLineType.TOTAL_DEBITS;
    }

    get isTotalCredits(): boolean {
        return this.transactionLineType == TransactionLineType.TOTAL_CREDITS;
    }

    get isCarriedFoward(): boolean {
        return this.transactionLineType == TransactionLineType.TOTAL_CARRIEDFWD;
    }

    get isTotalLine(): boolean {
        return ( this.transactionLineType == TransactionLineType.TOTAL_CARRIEDFWD ||
            this.transactionLineType == TransactionLineType.TOTAL_CREDITS ||
            this.transactionLineType == TransactionLineType.TOTAL_DEBITS ||
            this.transactionLineType == TransactionLineType.TOTAL_BOUGHTFWD )
    }

    get hasDate(): boolean {
        return this.transactionLineType == TransactionLineType.TRANSACTION ||
            this.transactionLineType == TransactionLineType.REGULAR_TRANSACTION ||
            this.transactionLineType == TransactionLineType.RECONCILE_TRANSACTION;
    }

    get hasAccount(): boolean {
        return this.transactionLineType == TransactionLineType.TRANSACTION ||
            this.transactionLineType == TransactionLineType.REGULAR_TRANSACTION ||
            this.transactionLineType == TransactionLineType.RECONCILE_TRANSACTION;
    }

    get hasCategory(): boolean {
        return this.transactionLineType == TransactionLineType.TRANSACTION ||
            this.transactionLineType == TransactionLineType.REGULAR_TRANSACTION ||
            this.transactionLineType == TransactionLineType.RECONCILE_TRANSACTION;
    }

    get myAmount(): number {
        if(this.transactionLineType == TransactionLineType.TRANSACTION ||
            this.transactionLineType == TransactionLineType.REGULAR_TRANSACTION  ||
             this.transactionLineType == TransactionLineType.RECONCILE_TRANSACTION) {
            return this.amount;
        }

        if(this.transactionLineType == TransactionLineType.TOTAL_BOUGHTFWD) {
            return this.summary.boughtFwd;
        }

        if(this.transactionLineType == TransactionLineType.TOTAL_DEBITS) {
            return this.summary.totalDebits;
        }

        if(this.transactionLineType == TransactionLineType.TOTAL_CREDITS) {
            return this.summary.totalCredits;
        }

        if(this.transactionLineType == TransactionLineType.TOTAL_CARRIEDFWD) {
            return this.summary.carriedForward;
        }

        return 0;
    }
}

export class TransactionSummary {
    canLock: boolean = false;
    totalsDisplay: Array<{ title: string,
        amount: number,
        displayAmt: string }> = [
        {title: 'Bought Forward', amount: 0, displayAmt: "0.00"},
        {title: 'Total Debits', amount: 0, displayAmt: "0.00"},
        {title: 'Total Credits', amount: 0, displayAmt: "0.00"},
        {title: 'Carried Forward', amount: 0, displayAmt: "0.00"}
    ];

    private setDisplayValues() {
        this.totalsDisplay.forEach(value => {
            value.displayAmt = value.amount.toFixed(2);
        });

        if(this.totalsDisplay[0].amount == 0) {
            this.totalsDisplay[0].displayAmt = "";
        }
    }

    private calculateCarriedFwd() {
        this.totalsDisplay[3].amount = this.totalsDisplay[0].amount + this.totalsDisplay[1].amount + this.totalsDisplay[2].amount;
        this.setDisplayValues();
    }

    set boughtForward(value: number) {
        this.totalsDisplay[0].amount = value;
        this.calculateCarriedFwd();
    }

    resetCreditsDetbits() {
        this.totalsDisplay[1].amount = 0;
        this.totalsDisplay[1].displayAmt = "0.00";
        this.totalsDisplay[2].amount = 0;
        this.totalsDisplay[2].displayAmt = "0.00";
        this.calculateCarriedFwd();
    }

    addAmount(value: number) {
        if (value < 0) {
            this.totalsDisplay[1].amount += value; // Debits
        } else {
            this.totalsDisplay[2].amount += value; // Credits
        }
        this.calculateCarriedFwd();
    }

    get boughtFwd(): number {
        return this.totalsDisplay[0].amount;
    }

    get totalDebits(): number {
        return this.totalsDisplay[1].amount;
    }

    get totalCredits(): number {
        return this.totalsDisplay[2].amount;
    }

    get carriedForward(): number {
        return this.totalsDisplay[3].amount;
    }
}
