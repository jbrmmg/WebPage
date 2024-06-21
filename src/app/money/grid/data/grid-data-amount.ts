import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";

@Component({
    selector: 'jbr-grid-data-amount',
    templateUrl: './grid-data-amount.html',
    styleUrls: ['./grid-data-amount.css'],
    standalone: true
})
export class GridDataAmount {
    @Input() transaction: ITransactionReport;
}
