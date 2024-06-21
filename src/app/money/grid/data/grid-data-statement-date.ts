import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";

@Component({
    selector: 'jbr-grid-data-statement-date',
    templateUrl: './grid-data-statement-date.html',
    styleUrls: ['./grid-data-statement-date.css'],
    standalone: true
})
export class GridDataStatementDate {
    @Input() transaction: ITransactionReport;

    display() : string {
        if(this.transaction.statement) {
            return String(this.transaction.statement.year) + "-" + String(this.transaction.statement.month);
        }

        return "";
    }
}
