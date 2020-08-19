import {IAccount} from '../money-account';
import {ICategory} from '../money-category';
import {IStatement} from '../money-statement';

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

export class ListRowSummary {
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
