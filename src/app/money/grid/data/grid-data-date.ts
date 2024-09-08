import {Component, HostListener} from "@angular/core";
import {DatePipe, NgIf} from "@angular/common";
import {MoneyService} from "../../money.service";
import {TransactionEditType} from "../../transaction/transactionEditType";
import {GridDataInlineEdit} from "./grid-data-inline-edit";
import {GridDataEvent} from "./grid-data-event";
import {HeaderType} from "../header/grid-header-type";
import {TransactionReport} from "../../transaction/transactionReport";

@Component({
    selector: 'jbr-grid-data-date',
    templateUrl: './grid-data-date.html',
    styleUrls: ['./grid-data-date.css'],
    imports: [
        DatePipe,
        NgIf
    ],
    standalone: true
})
export class GridDataDate extends GridDataInlineEdit {
    constructor() {
        super(TransactionEditType.Date);
    }

    @HostListener('document:click', ['$event'])
    clickOut(event) {
        if(this.inputElement != null) {
            if (!this.inputElement.nativeElement.contains(event.target)) {
                let value: string = this.inputElement.nativeElement.value;
                if(this.isEditing() && value.length > 0) {
                    this.completeEdit();
                }
            }
        }
    }

    onPopupDate() {
        console.log("Popup Date")
    }

    interpretInput(text: string): void {
        this.transaction.date = MoneyService.getDate(text);

        let event: GridDataEvent = new GridDataEvent();
        event.transaction = this.transaction;
        event.source = HeaderType.Date;
        this.valueChanged.emit(event);
    }

    getValueForEdit(): string {
        return this.transaction.date;
    }

    canEdit(): boolean {
        if(this.transaction.type != TransactionReport.TRANSACTION) {
            return false;
        }

        // Date can only be edited if the transaction is new or not reconciled.
        return this.transaction.new || this.transaction.statement == null;
    }
}
