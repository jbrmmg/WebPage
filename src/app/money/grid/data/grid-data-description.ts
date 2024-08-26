import {Component, EventEmitter, Output} from "@angular/core";
import {TransactionReport} from "../../transaction/transactionReport";
import {MoneyService} from "../../money.service";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TransactionEditType} from "../../transaction/transactionEditType";
import {GridDataInlineEdit} from "./grid-data-inline-edit";
import {GridDataEvent} from "./grid-data-event";
import {HeaderType} from "../header/grid-header-type";

@Component({
    selector: 'jbr-grid-data-description',
    templateUrl: './grid-data-description.html',
    styleUrls: ['./grid-data-description.css'],
    imports: [
        NgIf,
        FormsModule
    ],
    standalone: true
})
export class GridDataDescription extends GridDataInlineEdit {
    @Output() edit: EventEmitter<void> = new EventEmitter();

    constructor() {
        super(TransactionEditType.Description);
    }

    getDescription(): string {
        return MoneyService.getTransactionDescription(this.transaction);
    }

    blank(): boolean {
        if(this.transaction.type == TransactionReport.TRANSACTION) {
            return this.transaction.description == null || this.transaction.description.length == 0;
        }

        return !((this.transaction.type == TransactionReport.OPEN_BALANCE) ||
            (this.transaction.type == TransactionReport.TODAY_BALANCE) ||
            (this.transaction.type == TransactionReport.FUTURE_BALANCE));
    }

    getCategoryColour(): string {
        if(this.transaction == null || this.transaction.category == null || this.transaction.category.colour == null) {
            return "FFFFFF";
        }

        return this.transaction.category.colour;
    }

    getTextColour() {
        return MoneyService.getTextColor(this.getCategoryColour());
    }

    interpretInput(text: string): void {
        this.transaction.description = text;
        this.transaction.modified = true;

        let event: GridDataEvent = new GridDataEvent();
        event.transaction = this.transaction;
        event.source = HeaderType.Description;
        this.valueChanged.emit(event);
    }

    getValueForEdit(): string {
        return this.transaction.description;
    }

    canEdit(): boolean {
        // Can only edit description on transactions that are real.
        return this.transaction.category != null;
    }
}
