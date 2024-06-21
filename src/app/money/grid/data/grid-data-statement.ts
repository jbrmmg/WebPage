import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";
import {NgIf} from "@angular/common";

@Component({
    selector: 'jbr-grid-data-statement',
    templateUrl: './grid-data-statement.html',
    styleUrls: ['./grid-data-statement.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class GridDataStatement {
    @Input() transaction: ITransactionReport;
}
