import {Component, EventEmitter, Input, Output} from "@angular/core";
import {TransactionFilter} from "../../transaction/transactionFilter";
import {HeaderType} from "./grid-header-type";

export class FilterEvent {
    source: HeaderType;
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
