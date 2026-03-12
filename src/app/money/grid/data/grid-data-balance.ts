import {Component} from '@angular/core';
import {CurrencyPipe, NgIf} from '@angular/common';
import {GridData} from './grid-data';

@Component({
    selector: 'jbr-grid-data-balance',
    templateUrl: './grid-data-balance.html',
    styleUrls: ['./grid-data-balance.css'],
    imports: [
        CurrencyPipe,
        NgIf
    ],
    standalone: true
})
export class GridDataBalance extends GridData {
    display(): string {
        if (this.transaction.balance == null) {
            return '';
        }

        if (this.transaction.balance.value < 0) {
            return String(this.transaction.balance.value * -1);
        }

        return String(this.transaction.balance.value);
    }

    negative(): boolean {
        if (this.transaction.balance == null) {
            return false;
        }

        return this.transaction.balance.value < 0;
    }

    blank(): boolean {
        return this.transaction?.new;
    }
}
