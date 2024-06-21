import {Component, Input} from "@angular/core";
import {GridHeaderDate} from "./grid-header-date";
import {GridHeaderAmount} from "./grid-header-amount";
import {TransactionFilter} from "../../transaction/transactionFilter";
import {GridHeaderText} from "./grid-header-text";
import {GridHeaderAccount} from "./grid-header-account";
import {GridHeaderCategory} from "./grid-header-category";
import {GridHeaderFlag} from "./grid-header-flag";
import {GridHeaderStatementDate} from "./grid-header-statement-date";

@Component({
    selector: 'jbr-grid-header-row',
    templateUrl: './grid-header-row.html',
    styleUrls: ['./grid-header-row.css'],
    imports: [
        GridHeaderDate,
        GridHeaderAmount,
        GridHeaderText,
        GridHeaderAccount,
        GridHeaderCategory,
        GridHeaderFlag,
        GridHeaderStatementDate
    ],
    standalone: true
})
export class GridHeaderRow {
    @Input() filter: TransactionFilter;
}
