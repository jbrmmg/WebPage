import {Component, OnInit} from "@angular/core";
import {MoneyService} from "../money.service";
import {TransactionFilter} from "../transaction/transactionFilter";
import {ITransactionData} from "../transaction/TransactionData";

@Component({
    selector: 'jbr-money-newtrn',
    templateUrl: './money-newtrn-display.html',
    styleUrls: ['./money-newtrn-display.css']
})
export class MoneyNewtrnDisplay implements OnInit {
    data : ITransactionData;
    filter : TransactionFilter;

    constructor(private _moneyService: MoneyService) {
        this.data = null;
        this.filter = new TransactionFilter();
    }

    ngOnInit(): void {
        this.filter.predicted = false;
        this.filter.locked = false;
        this.filter.fromReconciled = false;
        this.filter.maxPageSize = 3;
    }

    onClickA() {
        this._moneyService.getTransactions2(this.filter).subscribe({
            next: (val) => {
                this.data = val;
                console.log(val.openBalance.value);
                console.log(val.todayBalance.value);
                console.log(val.forwardBalance.value);
                val.transactions.forEach(value => {
                    console.log(value.amount.value);
                })
                console.log('Next');
            },
            error: (response) => {
                console.error("getTransactions2 Failed " + response);
            },
            complete: () => {
                console.log("getTransactions2 Complete.")
            }
        });
    }
}
