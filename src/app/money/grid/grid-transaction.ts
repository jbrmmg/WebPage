import {Component, OnInit} from "@angular/core";
import {ITransactionData} from "../transaction/TransactionData";
import {TransactionFilter} from "../transaction/transactionFilter";
import {MoneyService} from "../money.service";
import {FlagType} from "./header/grid-header-flag-type";
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
import {GridDataAmount} from "./data/grid-data-amount";
import {GridDataBalance} from "./data/grid-data-balance";
import {GridDataCategory} from "./data/grid-data-category";
import {GridDataDescription} from "./data/grid-data-description";
import {GridDataFromReconciliation} from "./data/grid-data-from-reconciliation";
import {GridDataPredicted} from "./data/grid-data-predicted";
import {GridDataStatement} from "./data/grid-data-statement";
import {GridDataStatementDate} from "./data/grid-data-statement-date";
import {GridHeaderSelect} from "./header/grid-header-select";
import {GridHeaderActions} from "./header/grid-header-actions";
import {GridDataSelect} from "./data/grid-data-select";
import {GridDataActions} from "./data/grid-data-actions";
import {FilterEvent, GridHeader} from "./header/grid-header";

@Component({
    selector: 'jbr-grid-transaction',
    templateUrl: './grid-transaction.html',
    styleUrls: ['./grid-transaction.css'],
    imports: [
        NgForOf,
        NgIf,
        GridHeader,
        GridHeaderDate,
        GridHeaderAccount,
        GridHeaderAmount,
        GridHeaderCategory,
        GridHeaderFlag,
        GridHeaderStatementDate,
        GridHeaderText,
        GridHeaderSelect,
        GridHeaderActions,
        GridDataDate,
        GridDataAccount,
        GridDataAmount,
        GridDataBalance,
        GridDataCategory,
        GridDataDescription,
        GridDataFromReconciliation,
        GridDataPredicted,
        GridDataStatement,
        GridDataStatementDate,
        GridDataSelect,
        GridDataActions
    ],
    standalone: true
})
export class GridTransaction implements OnInit {
    protected readonly FlagType = FlagType;
    data : ITransactionData;
    filter : TransactionFilter;
    status: string;
    accountFiltered: boolean;
    lockedFiltered: boolean;
    predictedFiltered: boolean;
    reconciledFiltered: boolean;

    constructor(private _moneyService: MoneyService) {
        this.data = null;
        this.filter = new TransactionFilter();
        this.status = "ready";
        this.accountFiltered = false;
    }

    ngOnInit(): void {
        this.filter.predicted = null;
        this.filter.locked = null;
        this.filter.fromReconciled = null;
        this.filter.maxPageSize = 25;
    }

    updateA() {
        this.filter.predicted = null;
        this.filter.locked = null;
        this.filter.fromReconciled = null;
        this.filter.maxPageSize = 25;
        this.update();
    }

    lockedChanged(event: FilterEvent) {
        this.lockedFiltered = event.filtered;

        // Update the transactions.
        this.update();
    }

    predictedChanged(event: FilterEvent) {
        this.predictedFiltered = event.filtered;

        // Update the transactions.
        this.update();
    }

    reconciledChanged(event: FilterEvent) {
        this.reconciledFiltered = event.filtered;

        // Update the transactions.
        this.update();
    }

    accountChanged(event: FilterEvent){
        this.accountFiltered = event.filtered;

        // Update the transactions.
        this.update();
    }

    update() {
        this.status = "updating..."
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
                this.status = "error"
                console.error("getTransactions2 Failed " + response);
            },
            complete: () => {
                this.status = "ready"
                console.log("getTransactions2 Complete.")
            }
        });
    }
}
