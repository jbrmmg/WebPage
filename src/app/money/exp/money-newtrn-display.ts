import {Component, OnInit} from "@angular/core";
import {MoneyService} from "../money.service";
import {TransactionFilter} from "../transaction/transactionFilter";

@Component({
    selector: 'jbr-money-newtrn',
    templateUrl: './money-newtrn-display.html',
    styleUrls: ['./money-newtrn-display.css']
})
export class MoneyNewtrnDisplay implements OnInit {
    constructor(private _moneyService: MoneyService) {

    }

    ngOnInit(): void {
    }

    onClickA() {
        console.log("here")

        let filter : TransactionFilter = new TransactionFilter();
        filter.predicted = false;
        filter.locked = false;
        filter.fromReconciled = false;

        console.log("Filter setup")

        this._moneyService.getTransactions2(filter).subscribe({
            next: (val) => {
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
