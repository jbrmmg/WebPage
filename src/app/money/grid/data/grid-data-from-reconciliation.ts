import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";
import {NgIf} from "@angular/common";

@Component({
    selector: 'jbr-grid-data-from-reconciliation',
    templateUrl: './grid-data-from-reconciliation.html',
    styleUrls: ['./grid-data-from-reconciliation.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class GridDataFromReconciliation {
    @Input() transaction: ITransactionReport;
}
