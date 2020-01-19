export interface ITransaction {
    id: number;
    account: string;
    category: string;
    date: Date;
    amount: number;
    locked: boolean;
    group: string;
    oppositeStatementId: string;
    description: string;
    oppositeId: number;
    catColour: string;
    categoryId: string;
    dateYear: number;
    dateMonth: string;
    reconciled: boolean;
    dateDay: number;
}

export enum TransactionLineType {
    TRANSACTION,
    TOTAL_BOUGHTFWD,
    TOTAL_DEBITS,
    TOTAL_CREDITS,
    TOTAL_CARRIEDFWD
}

export class Transaction implements ITransaction {
    id: number = -1;
    account: string = null;
    category: string = null;
    date: Date = null;
    amount: number = 0.0;
    locked: boolean = true;
    group: string = null;
    oppositeStatementId: string = null;
    oppositeId: number = -1;
    catColour: string = null;
    categoryId: string = null;
    dateYear: number = -1;
    dateMonth: string = null;
    reconciled: boolean = true;
    dateDay: number = -1;
    editable: boolean = false;
    transactionLineType: TransactionLineType = TransactionLineType.TRANSACTION;
    summary: TransactionSummary = null;
    description: string = "";

    constructor(source: ITransaction,
                summary: TransactionSummary,
                type: TransactionLineType) {
        if(source != null) {
            this.id = source.id;
            this.account = source.account;
            this.category = source.category;
            this.date = source.date;
            this.amount = source.amount;
            this.locked = source.locked;
            this.group = source.group;
            this.oppositeStatementId = source.oppositeStatementId;
            this.oppositeId = source.oppositeId;
            this.catColour = source.catColour;
            this.categoryId = source.categoryId;
            this.dateYear = source.dateYear;
            this.dateMonth = source.dateMonth;
            this.reconciled = source.reconciled;
            this.dateDay = source.dateDay;
            this.description = source.description;
        }
        this.transactionLineType = type;
        this.summary = summary;
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
        return this.transactionLineType == TransactionLineType.TRANSACTION;
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
