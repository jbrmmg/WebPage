import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";

@Component({
    selector: 'jbr-grid-data-predicted',
    templateUrl: './grid-data-predicted.html',
    styleUrls: ['./grid-data-predicted.css'],
    standalone: true
})
export class GridDataPredicted {
    @Input() transaction: ITransactionReport;
}
