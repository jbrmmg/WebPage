import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ITransactionReport} from '../../transaction/transactionReport';
import {GridDataEvent} from './grid-data-event';

@Component({
    selector: '',
    template: '',
    standalone: true,
    styles: []
})
export class GridData {
    @Input() transaction: ITransactionReport;
    @Output() valueChanged: EventEmitter<GridDataEvent> = new EventEmitter();
}
