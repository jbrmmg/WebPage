import {Component, OnInit} from "@angular/core";
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
import {HeaderType} from "./header/grid-header-type";
import {ITransactionReport} from "../transaction/TransactionReport";

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
    data : ITransactionReport[];
    filter : TransactionFilter;
    status: string;

    constructor(private _moneyService: MoneyService) {
        this.data = null;
        this.filter = new TransactionFilter();
        this.status = "ready";
    }

    ngOnInit(): void {
        this.filter.predicted = false;
        this.filter.locked = false;
        this.filter.fromReconciled = false;
        this.filter.maxPageSize = 200;
        this.update();
    }

    headerFiltered(header: HeaderType): boolean {
        // Determine if the header is filtered based on the filter.
        switch (header) {
            case HeaderType.Account:
                return !(this.filter.accounts == null || this.filter.accounts.length == 0);

            case HeaderType.Locked:
                return this.filter.locked != null;

            case HeaderType.Predicted:
                return this.filter.predicted != null;

            case HeaderType.Reconciliation:
                return this.filter.fromReconciled != null;

            case HeaderType.Category:
                return !(this.filter.categories == null || this.filter.categories.length == 0);

            case HeaderType.StatementDate:
                return this.filter.statementDate != null;

            case HeaderType.Date:
                return this.filter.dateRange != null;

            case HeaderType.Description:
                return this.filter.description != null;

            case HeaderType.Credit:
            case HeaderType.Debit:
                return this.filter.valueRange != null;
        }

        // Default - not filtered
        return false;
    }

    filterChange(event: FilterEvent) {
        console.log("Update from " + event.source);

        // Update the transactions.
        this.update();
    }

    update() {
        this.status = "updating..."
        this._moneyService.getTransactions2(this.filter).subscribe({
            next: (val) => {
                this.data = val;
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

    protected readonly HeaderType = HeaderType;
}
