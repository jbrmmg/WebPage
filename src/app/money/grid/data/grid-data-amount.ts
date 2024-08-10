import {Component, Input} from "@angular/core";
import {CurrencyPipe, NgIf} from "@angular/common";
import {GridData} from "./grid-data";

@Component({
    selector: 'jbr-grid-data-amount',
    templateUrl: './grid-data-amount.html',
    styleUrls: ['./grid-data-amount.css'],
    imports: [
        CurrencyPipe,
        NgIf
    ],
    standalone: true
})
export class GridDataAmount extends GridData {
    @Input() type: string;

    debit(): boolean {
        return this.type == "DB";
    }

    display() : string {
        if(this.transaction == null || this.transaction.amount == null || this.transaction.amount.type != this.type) {
            return "";
        }

        if(this.type == "DB") {
            return String(this.transaction.amount.value * -1);
        }

        return String(this.transaction.amount.value);
    }
}
