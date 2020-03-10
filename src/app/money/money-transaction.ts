import {IRegular} from "./money-regular";
import {IAccount} from "./money-account";
import {ICategory} from "./money-category";
import {IStatement} from "./money-statement";

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

export enum TransactionLineType {
    TRANSACTION,
    TOTAL_BOUGHTFWD,
    TOTAL_DEBITS,
    TOTAL_CREDITS,
    TOTAL_CARRIEDFWD,
    REGULAR_TRANSACTION
}

export class Transaction implements ITransaction {
    id: number = -1;
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

    constructor(source: ITransaction,
                regular: IRegular,
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
            this.reconciled = (this.statement != null) ? true : false;
        } else if(regular != null)  {
            this.id = regular.id;
            this.category = regular.category;
            this.date = regular.lastDate == null ? null :  new Date(regular.lastDate);
            this.amount = regular.amount;
            this.description = regular.description;
            this.account = regular.account;
            this.statement = null;
        }
        this.transactionLineType = type;
        this.summary = summary;
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

    set amountString(value:string) {
        // Check that the string can be an amount.
        if(isNaN(Number(value))) {
            return;
        }

        this.amount = Number(value);
    }

    get amountString(): string {
        return this.amount.toFixed(2);
    }

    get isTransactionLine(): boolean {
        return this.transactionLineType == TransactionLineType.TRANSACTION || this.transactionLineType == TransactionLineType.REGULAR_TRANSACTION;
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
        return this.transactionLineType == TransactionLineType.TRANSACTION || this.transactionLineType == TransactionLineType.REGULAR_TRANSACTION;
    }

    get hasAccount(): boolean {
        return this.transactionLineType == TransactionLineType.TRANSACTION || this.transactionLineType == TransactionLineType.REGULAR_TRANSACTION;
    }

    get hasCategory(): boolean {
        return this.transactionLineType == TransactionLineType.TRANSACTION || this.transactionLineType == TransactionLineType.REGULAR_TRANSACTION;
    }

    get hasDescription(): boolean {
        return this.transactionLineType == TransactionLineType.TRANSACTION || this.transactionLineType == TransactionLineType.REGULAR_TRANSACTION;
    }

    get myAmount(): number {
        if(this.transactionLineType == TransactionLineType.TRANSACTION || this.transactionLineType == TransactionLineType.REGULAR_TRANSACTION) {
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

    get myDisplayAmount(): string {
        if(this.transactionLineType == TransactionLineType.TRANSACTION || this.transactionLineType == TransactionLineType.REGULAR_TRANSACTION) {
            return this.amountString;
        }

        if(this.transactionLineType == TransactionLineType.TOTAL_BOUGHTFWD) {
            return this.summary.boughtFwdDisplay;
        }

        if(this.transactionLineType == TransactionLineType.TOTAL_DEBITS) {
            return this.summary.totalDebitsDisplay;
        }

        if(this.transactionLineType == TransactionLineType.TOTAL_CREDITS) {
            return this.summary.totalCreditsDisplay;
        }

        if(this.transactionLineType == TransactionLineType.TOTAL_CARRIEDFWD) {
            return this.summary.carriedForwardDisplay;
        }

        return "0.00";
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

    get boughtFwdDisplay(): string {
        return this.totalsDisplay[0].displayAmt;
    }

    get totalDebits(): number {
        return this.totalsDisplay[1].amount;
    }

    get totalDebitsDisplay(): string {
        return this.totalsDisplay[1].displayAmt;
    }

    get totalCredits(): number {
        return this.totalsDisplay[2].amount;
    }

    get totalCreditsDisplay(): string {
        return this.totalsDisplay[2].displayAmt;
    }

    get carriedForward(): number {
        return this.totalsDisplay[3].amount;
    }

    get carriedForwardDisplay(): string {
        return this.totalsDisplay[3].displayAmt;
    }
}
