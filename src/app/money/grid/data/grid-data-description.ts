import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ITransactionReport, TransactionReport} from "../../transaction/TransactionReport";
import {MoneyService} from "../../money.service";
import {NgIf} from "@angular/common";

@Component({
    selector: 'jbr-grid-data-description',
    templateUrl: './grid-data-description.html',
    styleUrls: ['./grid-data-description.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class GridDataDescription {
    @Input() transaction: ITransactionReport;
    @Output() edit: EventEmitter<void> = new EventEmitter();

    protected readonly MoneyService = MoneyService;

    constructor() {
    }

    getDescription(): string {
        if(this.transaction.type == TransactionReport.TRANSACTION) {
            return this.transaction.description;
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

        return "";
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

    onClick() {
        // Is this field editable?
        if(this.transaction.type == TransactionReport.TRANSACTION) {
            if(!this.transaction.editing) {
                this.edit.emit();
                this.transaction.editing = true;
            } else {
                this.transaction.editing = false;
            }
            return;
        }

        this.transaction.editing = false;
    }
}
