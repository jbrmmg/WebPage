import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";

@Component({
    selector: 'jbr-grid-data-statement',
    templateUrl: './grid-data-statement.html',
    styleUrls: ['./grid-data-statement.css'],
    standalone: true
})
export class GridDataStatement {
    @Input() transaction: ITransactionReport;
}
