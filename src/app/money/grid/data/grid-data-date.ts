import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";

@Component({
    selector: 'jbr-grid-data-date',
    templateUrl: './grid-data-date.html',
    styleUrls: ['./grid-data-date.css'],
    standalone: true
})
export class GridDataDate {
    @Input() transaction: ITransactionReport;
}
