import {Component, Input} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";

@Component({
    selector: 'jbr-grid-data-select',
    templateUrl: './grid-data-select.html',
    styleUrls: ['./grid-data-select.css'],
    standalone: true
})
export class GridDataSelect {
    @Input() transaction: ITransactionReport;

    constructor() {
    }

    text(): string {
        return this.transaction.new ? "*" : "";
    }
}
