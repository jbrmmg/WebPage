import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";

@Component({
    selector: 'jbr-grid-data-statement-date',
    templateUrl: './grid-data-statement-date.html',
    styleUrls: ['./grid-data-statement-date.css'],
    standalone: true
})
export class GridDataStatementDate {
    @Input() transaction: ITransactionReport;
}
