import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";

@Component({
    selector: 'jbr-grid-data-actions',
    templateUrl: './grid-data-actions.html',
    styleUrls: ['./grid-data-actions.css'],
    standalone: true
})
export class GridDataActions {
    @Input() transaction: ITransactionReport;
}
