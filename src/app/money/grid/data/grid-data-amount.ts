import {Component, Input} from "@angular/core";
import {CurrencyPipe, NgIf} from "@angular/common";
import {MoneyService} from "../../money.service";
import {GridDataInlineEdit} from "./grid-data-inline-edit";
import {TransactionEditType} from "../../transaction/transactionEditType";
import {GridDataEvent} from "./grid-data-event";
import {HeaderType} from "../header/grid-header-type";

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
export class GridDataAmount extends GridDataInlineEdit {
    @Input() type: string;

    constructor() {
        super(TransactionEditType.Amount);
    }

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

    isBlank(): boolean {
        return this.transaction == null || this.transaction.amount == null || this.transaction.amount.type != this.type;
    }

    interpretInput(text: string): void {
        let number = MoneyService.getFinanceValue(text);

        let event: GridDataEvent = new GridDataEvent();
        event.transaction = this.transaction;
        this.transaction.modified = true;

        if(this.type == "DB") {
            if(number < 0) {
                this.transaction.amount.value = number * -1;
                this.transaction.amount.type = "CR";
                event.source = HeaderType.Credit;
            } else {
                this.transaction.amount.value = number * -1;
                this.transaction.amount.type = "DB";
                event.source = HeaderType.Debit;
            }
        } else {
            if(number < 0) {
                this.transaction.amount.value = number;
                this.transaction.amount.type = "DB";
                event.source = HeaderType.Debit;
            } else {
                this.transaction.amount.value = number;
                this.transaction.amount.type = "CR";
                event.source = HeaderType.Credit;
            }
        }

        this.valueChanged.emit(event);
    }

    getValueForEdit(): string {
        let text: string;

        text = "";
        if(this.transaction != null && this.transaction.amount != null && this.transaction.amount.value != 0) {
            text = this.transaction.amount.value.toString();
            text = text.replace("-", "");
        }

        return text;
    }

    canEdit(): boolean {
        // Amount can only be edited if new or not reconciled.
        return this.transaction.new || (this.transaction.statement == null && this.transaction.category != null);
    }
}
