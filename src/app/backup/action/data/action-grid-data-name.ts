import {Component, EventEmitter, Output} from '@angular/core';
import {ActionGridData} from './action-grid-data';

@Component({
    selector: 'jbr-action-data-name',
    templateUrl: './action-grid-data-name.html',
    styleUrls: ['./action-grid-data.css'],
    imports: [],
    standalone: true
})
export class ActionGridDataName extends ActionGridData {
    @Output() fileSelected: EventEmitter<number> = new EventEmitter<number>();

    getText(): string {
        return this.action?.fileName ?? '';
    }

    getActionName(): string {
        return this.action?.action ?? '';
    }

    getActionBadgeClass(): string {
        switch (this.action?.action) {
            case 'DELETE':  return 'badge-delete';
            case 'MOVE':    return 'badge-move';
            case 'COPY':    return 'badge-copy';
            case 'RENAME':  return 'badge-rename';
            default:        return 'badge-default';
        }
    }

    selectMedia(): void {
        this.fileSelected.emit(this.action.fileId);
    }
}
