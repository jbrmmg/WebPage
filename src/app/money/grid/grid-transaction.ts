import {Component, OnInit} from "@angular/core";
import {ITransactionData} from "../transaction/TransactionData";
import {TransactionFilter} from "../transaction/transactionFilter";
import {MoneyService} from "../money.service";
import {NgForOf, NgIf} from "@angular/common";
import {FlagType} from "./header/grid-header-flag-type";
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
import {GridHeaderSelect} from "./header/grid-header-select";
import {GridHeaderActions} from "./header/grid-header-actions";
import {GridDataSelect} from "./data/grid-data-select";
import {GridDataActions} from "./data/grid-data-actions";

@Component({
    selector: 'jbr-grid-transaction',
    templateUrl: './grid-transaction.html',
    styleUrls: ['./grid-transaction.css'],
    imports: [
        NgForOf,
        NgIf,
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
        GridDataAmountCredit,
        GridDataAmountDebit,
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

    updatePredictedFilter() {
        // Cycle around the values; true, false, null
        if(this.filter.predicted == null) {
            this.filter.predicted = true;
        } else if(this.filter.predicted) {
            this.filter.predicted = false;
        } else {
            this.filter.predicted = null;
        }
        this.filter.maxPageSize = null;
        this.update();
    }

    updateLockFilter() {
        // Cycle around the values; true, false, null
        if(this.filter.locked == null) {
            this.filter.locked = true;
        } else if(this.filter.locked) {
            this.filter.locked = false;
        } else {
            this.filter.locked = null;
        }
        this.update();
    }

    updateReconciledFilter() {
        // Cycle around the values; true, false, null
        if(this.filter.fromReconciled == null) {
            this.filter.fromReconciled = true;
        } else if(this.filter.fromReconciled) {
            this.filter.fromReconciled = false;
        } else {
            this.filter.fromReconciled = null;
        }
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

    protected readonly FlagType = FlagType;
}
