import {Component} from "@angular/core";
import {DatePipe, NgIf} from "@angular/common";
import {MoneyService} from "../../money.service";
import {TransactionEditType} from "../../transaction/transactionEditType";
import {GridDataInlineEdit} from "./grid-data-inline-edit";
import {GridDataChangeEvent} from "./grid-data-change-event";
import {HeaderType} from "../header/grid-header-type";

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

    interpretInput(text: string): void {
        this.transaction.date = MoneyService.getDate(text);

        let event: GridDataChangeEvent = new GridDataChangeEvent();
        event.transaction = this.transaction;
        event.source = HeaderType.Date;
        this.valueChanged.emit(event);
    }

    getValueForEdit(): string {
        return "";
    }
}
