import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";

@Component({
    selector: 'jbr-grid-data-amount-debit',
    templateUrl: './grid-data-amount-debit.html',
    styleUrls: ['./grid-data-amount-debit.css'],
    standalone: true
})
export class GridDataAmountDebit {
    @Input() transaction: ITransactionReport;

    display() : string {
        if(this.transaction == null || this.transaction.amount.type === "CR") {
            return "";
        }

        return String(this.transaction.amount.value);
    }
}
