import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TransactionFilter} from '../../transaction/transactionFilter';
import {ValueRange} from '../../range/valueRange';

class Amount {
    display: string;
    value: number;
    isNull: boolean;
    isValid: boolean;

    valueUpdate(value: number) {
        if (value == null) {
            this.setNull();
        } else {
            this.value = value;
            this.display = value.toString();
        }
    }

    displayUpdate(display: string) {
        if (display == null) {
            this.setNull();
            return;
        }

        const tempValue = Number.parseInt(display, 10);

        this.display = display;
        if (this.display.trim().length <= 0) {
            this.setNull();
            return;
        }

        if (Number.isNaN(tempValue)) {
            this.isValid = false;
            this.value = null;
            this.isNull = true;
        } else {
            this.isValid = true;
            this.value = tempValue;
            this.isNull = false;
        }
    }

    setNull() {
        this.display = '';
        this.value = null;
        this.isNull = true;
        this.isValid = true;
    }
}

@Component({
    selector: 'jbr-filter-amount',
    templateUrl: './grid-filter-amount.html',
    styleUrls: ['./grid-filter-amount.css'],
    imports: [
        FormsModule
    ],
    host: {'style': 'padding: 0;'},
    standalone: true
})
export class GridFilterAmount implements OnInit {
    @Input() filter: TransactionFilter;
    @Input() okEvent: EventEmitter<void>;

    fromAmount: Amount = new Amount();
    toAmount: Amount = new Amount();

    ngOnInit(): void {
        // Set up the event handlers.
        if (this.okEvent != null) {
            this.okEvent.subscribe(() => {
                this.onOK();
            });
        }

        // Set up the range.
        if (this.filter?.valueRange != null) {
            this.fromAmount.valueUpdate(this.filter.valueRange.minimum);
            this.toAmount.valueUpdate(this.filter.valueRange.maximum);
        } else {
            this.fromAmount.setNull();
            this.toAmount.setNull();
        }
    }

    change(event: any, amount: Amount) {
        amount.displayUpdate(event.target.value);
    }

    onOK() {
        if (this.filter != null) {
            let min: number = this.fromAmount.value;
            let max: number = this.toAmount.value;

            if ((!this.fromAmount.isNull && !this.toAmount.isNull) && (min > max)) {
                min = this.toAmount.value;
                max = this.fromAmount.value;
            }

            if (this.fromAmount.isNull && this.toAmount.isNull) {
                this.filter.valueRange = null;
            } else {
                this.filter.valueRange = new ValueRange(min, max);
            }
        }
    }
}
