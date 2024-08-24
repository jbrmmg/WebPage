import {Component} from "@angular/core";
import {DatePipe, NgIf} from "@angular/common";
import {MoneyService} from "../../money.service";
import {TransactionEditType} from "../../transaction/transactionEditType";
import {GridDataInlineEdit} from "./grid-data-inline-edit";

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
    }

    getValueForEdit(): string {
        return "";
    }
}
