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

    constructor(private _moneyService: MoneyService) {
        this.data = null;
    }

    ngOnInit(): void {
    }

    onClickA() {
        console.log("here")

        let filter : TransactionFilter = new TransactionFilter();
        filter.predicted = false;
        filter.locked = false;
        filter.fromReconciled = false;
        filter.maxPageSize = 3;

        console.log("Filter setup")

        this._moneyService.getTransactions2(filter).subscribe({
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
