import {Component, EventEmitter, Output} from '@angular/core';
import {ActionGridData} from './action-grid-data';

@Component({
    selector: 'jbr-action-data-name',
    templateUrl: './action-grid-data-name.html',
    styleUrls: ['./action-grid-data.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridDataName extends ActionGridData {
    @Output() fileSelected: EventEmitter<number> = new EventEmitter<number>();

    getText(): string {
        if (this.action && this.action.fileName) {
            return this.action.fileName;
        }

        return '';
    }

    getActionName(): string {
        if (this.action && this.action.action) {
            return this.action.action;
        }

        return '';
    }

    selectMedia() {
        console.log('Select Media');
        this.fileSelected.emit(this.action.fileId);
    }
}
