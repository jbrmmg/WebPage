import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";

@Component({
    selector: 'jbr-grid-data-amount-credit',
    templateUrl: './grid-data-amount-credit.html',
    styleUrls: ['./grid-data-amount-credit.css'],
    standalone: true
})
export class GridDataAmountCredit {
    @Input() transaction: ITransactionReport;

    display() : string {
        if(this.transaction == null || this.transaction.amount.type === "DB") {
            return "";
        }

        return String(this.transaction.amount.value);
    }
}
