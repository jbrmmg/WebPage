import {Component, OnInit} from "@angular/core";
import {ITransactionData} from "../transaction/TransactionData";
import {TransactionFilter} from "../transaction/transactionFilter";
import {MoneyService} from "../money.service";
import {NgForOf, NgIf} from "@angular/common";
import {GridHeaderDate} from "./header/grid-header-date";
import {GridDataDate} from "./data/grid-data-date";
import {GridHeaderAccount} from "./header/grid-header-account";
import {GridHeaderAmount} from "./header/grid-header-amount";
import {GridHeaderCategory} from "./header/grid-header-category";
import {GridHeaderFlag} from "./header/grid-header-flag";
import {GridHeaderStatementDate} from "./header/grid-header-statement-date";
import {GridHeaderText} from "./header/grid-header-text";
import {GridDataAccount} from "./data/grid-data-account";
import {GridDataAmountCredit} from "./data/grid-data-amount-credit";
import {GridDataBalance} from "./data/grid-data-balance";
import {GridDataCategory} from "./data/grid-data-category";
import {GridDataDescription} from "./data/grid-data-description";
import {GridDataFromReconciliation} from "./data/grid-data-from-reconciliation";
import {GridDataPredicted} from "./data/grid-data-predicted";
import {GridDataStatement} from "./data/grid-data-statement";
import {GridDataStatementDate} from "./data/grid-data-statement-date";
import {GridDataAmountDebit} from "./data/grid-data-amount-debit";

@Component({
    selector: 'jbr-grid-transaction',
    templateUrl: './grid-transaction.html',
    styleUrls: ['./grid-transaction.css'],
    imports: [
        NgForOf,
        GridHeaderDate,
        NgIf,
        GridDataDate,
        GridHeaderAccount,
        GridHeaderAmount,
        GridHeaderCategory,
        GridHeaderFlag,
        GridHeaderStatementDate,
        GridHeaderText,
        GridDataAccount,
        GridDataAmountCredit,
        GridDataBalance,
        GridDataCategory,
        GridDataDescription,
        GridDataFromReconciliation,
        GridDataPredicted,
        GridDataStatement,
        GridDataStatementDate,
        GridDataAmountCredit,
        GridDataAmountCredit,
        GridDataAmountCredit,
        GridDataAmountCredit,
        GridDataAmountDebit
    ],
    standalone: true
})
export class GridTransaction implements OnInit {
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

    updateA() {
        this.filter.predicted = false;
        this.filter.locked = false;
        this.filter.fromReconciled = false;
        this.filter.maxPageSize = 3;
        this.update();
    }

    updateP() {
        this.filter.predicted = true;
        this.filter.locked = false;
        this.filter.fromReconciled = false;
        this.filter.maxPageSize = null;
        this.update();
    }

    updateL() {
        this.filter.predicted = false;
        this.filter.locked = true;
        this.filter.fromReconciled = false;
        this.filter.maxPageSize = 3;
        this.update();
    }

    updateR() {
        this.filter.predicted = false;
        this.filter.locked = false;
        this.filter.fromReconciled = true;
        this.filter.maxPageSize = 3;
        this.update();
    }

    update() {
        this._moneyService.getTransactions2(this.filter).subscribe({
            next: (val) => {
                this.data = val;
                if(val.openBalance.value != null) {
                    console.log(val.openBalance.value);
                }
                if(val.todayBalance.value != null) {
                    console.log(val.todayBalance.value);
                }
                if(val.forwardBalance.value != null) {
                    console.log(val.forwardBalance.value);
                }
                val.transactions.forEach(value => {
                    console.log(value.amount.value);
                })
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
