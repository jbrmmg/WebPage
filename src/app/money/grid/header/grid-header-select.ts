import {Component, EventEmitter, Input, Output} from '@angular/core';

export class SelectChange {
    selection: boolean;
}

@Component({
    selector: 'jbr-grid-header-select',
    templateUrl: './grid-header-select.html',
    styleUrls: ['./grid-header-select.css'],
    standalone: true
})
export class GridHeaderSelect {
    @Input() header: string;
    @Output() selectionChange: EventEmitter<SelectChange> = new EventEmitter();

    selectAll() {
        const event: SelectChange = new SelectChange();
        event.selection = true;
        this.selectionChange.emit(event);
    }

    selectNone() {
        const event: SelectChange = new SelectChange();
        event.selection = false;
        this.selectionChange.emit(event);
    }
}
