import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";
import {GridDataChangeEvent} from "./grid-data-change-event";

@Component({
    selector: '',
    template: '',
    standalone: true,
    styles: []
})
export class GridData {
    @Input() transaction: ITransactionReport;
    @Output() valueChanged: EventEmitter<GridDataChangeEvent> = new EventEmitter();
}
