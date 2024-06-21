import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";

@Component({
    selector: 'jbr-grid-data-balance',
    templateUrl: './grid-data-balance.html',
    styleUrls: ['./grid-data-balance.css'],
    standalone: true
})
export class GridDataBalance {
    @Input() transaction: ITransactionReport;
}
