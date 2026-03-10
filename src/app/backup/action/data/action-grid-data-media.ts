import {Component, EventEmitter, Output} from '@angular/core';
import {ActionGridData} from './action-grid-data';
import {DecimalPipe, NgIf, NgOptimizedImage} from '@angular/common';

@Component({
    selector: 'jbr-action-data-media',
    templateUrl: './action-grid-data-media.html',
    styleUrls: ['./action-grid-data.css'],
    imports: [
        NgIf,
        NgOptimizedImage,
        DecimalPipe
    ],
    standalone: true
})
export class ActionGridDataMedia extends ActionGridData {
    @Output() fileSelected: EventEmitter<number> = new EventEmitter<number>();

    getDateText() {
        const dateString: string = '' + this.action.date;

        if (this.action && this.action.date) {
            return '' + dateString.replace('T', ' ');
        }

        return '';
    }

    displaySize(): boolean {
        return !!(this.action && this.action.size);
    }

    getSize() {
        if (this.action && this.action.size) {
            return this.action.size;
        }
    }

    getFileId(): number {
        if (this.action && this.action.fileId) {
            return this.action.fileId;
        }

        return null;
    }

    isImage(): boolean {
        if (this.action && this.action.isImage) {
            return this.action.isImage;
        }

        return false;
    }

    isVideo(): boolean {
        if (this.action && this.action.isVideo) {
            return this.action.isVideo;
        }

        return false;
    }

    getText(): string {
        if (this.action && this.action.isImage) {
            return '' + this.action.isImage;
        }

        return '';
    }

    selectMedia() {
        console.log('Select Media');
        this.fileSelected.emit(this.action.fileId);
    }
}
