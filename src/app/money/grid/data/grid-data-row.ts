import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";
import {GridDataDate} from "./grid-data-date";
import {GridDataAmount} from "./grid-data-amount";
import {GridDataDescription} from "./grid-data-description";
import {GridDataAccount} from "./grid-data-account";
import {GridDataCategory} from "./grid-data-category";
import {GridDataBalance} from "./grid-data-balance";
import {GridDataStatement} from "./grid-data-statement";
import {GridDataPredicted} from "./grid-data-predicted";
import {GridDataFromReconciliation} from "./grid-data-from-reconciliation";
import {GridDataStatementDate} from "./grid-data-statement-date";

@Component({
    selector: 'jbr-grid-data-row',
    templateUrl: './grid-data-row.html',
    styleUrls: ['./grid-data-row.css'],
    imports: [
        GridDataDate,
        GridDataAmount,
        GridDataDescription,
        GridDataAccount,
        GridDataCategory,
        GridDataBalance,
        GridDataStatement,
        GridDataPredicted,
        GridDataFromReconciliation,
        GridDataStatementDate
    ],
    standalone: true
})
export class GridDataRow {
    @Input() transaction: ITransactionReport;
}
