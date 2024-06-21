import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";
import {NgIf} from "@angular/common";

@Component({
    selector: 'jbr-grid-data-predicted',
    templateUrl: './grid-data-predicted.html',
    styleUrls: ['./grid-data-predicted.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class GridDataPredicted {
    @Input() transaction: ITransactionReport;
}
