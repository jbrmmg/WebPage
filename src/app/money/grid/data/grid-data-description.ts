import {Component, EventEmitter, Output} from "@angular/core";
import {TransactionReport} from "../../transaction/TransactionReport";
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

    protected readonly MoneyService = MoneyService;

    constructor() {
        super(TransactionEditType.Description);
    }

    getDescription(): string {
        if(this.transaction.type == TransactionReport.TRANSACTION) {
            if(this.transaction.description == null || this.transaction.description.length == 0) {
                return "&nbsp;";
            } else {
                return this.transaction.description;
            }
        }

        if(this.transaction.type == TransactionReport.OPEN_BALANCE) {
            return "Opening Balance"
        }

        if(this.transaction.type == TransactionReport.TODAY_BALANCE) {
            return "Balance Today"
        }

        if(this.transaction.type == TransactionReport.FUTURE_BALANCE) {
            return "Future Balance"
        }

        return "&nbsp;";
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

        let event: GridDataEvent = new GridDataEvent();
        event.transaction = this.transaction;
        event.source = HeaderType.Description;
        this.valueChanged.emit(event);
    }

    getValueForEdit(): string {
        return this.transaction.description;
    }
}
