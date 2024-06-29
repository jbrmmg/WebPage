import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'jbr-grid-data-date',
    templateUrl: './grid-data-date.html',
    styleUrls: ['./grid-data-date.css'],
    imports: [
        DatePipe
    ],
    standalone: true
})
export class GridDataDate {
    @Input() transaction: ITransactionReport;
}
