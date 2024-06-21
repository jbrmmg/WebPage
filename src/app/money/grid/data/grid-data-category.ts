import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";

@Component({
    selector: 'jbr-grid-data-category',
    templateUrl: './grid-data-category.html',
    styleUrls: ['./grid-data-category.css'],
    standalone: true
})
export class GridDataCategory {
    @Input() transaction: ITransactionReport;
}
