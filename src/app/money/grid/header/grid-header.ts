import {Component, EventEmitter, Input, Output} from "@angular/core";
import {TransactionFilter} from "../../transaction/transactionFilter";

export class FilterEvent {
    filtered: boolean;
}

@Component({
    selector: '',
    template: '',
    standalone: true,
    styles: []
})
export class GridHeader {
    @Input() header: string;
    @Input() filter : TransactionFilter;

    @Output() filterChanged: EventEmitter<FilterEvent> = new EventEmitter();
}
