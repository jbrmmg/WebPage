import {Component, Input} from "@angular/core";
import {ITransactionReport, TransactionReport} from "../../transaction/TransactionReport";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'jbr-grid-data-select',
    templateUrl: './grid-data-select.html',
    styleUrls: ['./grid-data-select.css'],
    imports: [
        NgIf,
        FormsModule
    ],
    standalone: true
})
export class GridDataSelect {
    @Input() transaction: ITransactionReport;

    constructor() {
    }

    selected(): boolean {
        if (this.transaction.selected == null) {
            return false;
        }

        return this.transaction.selected;
    }

    select() {
        if(this.transaction.selected == null) {
            this.transaction.selected = false;
        }

        this.transaction.selected = !this.transaction.selected;
    }
}
