import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgIf} from '@angular/common';
import {FileInfoExtra} from '../../backup-fileinfoextra';

@Component({
    selector: 'jbr-backup-display-title',
    templateUrl: './backup-display-title.html',
    styleUrls: ['./backup-display-title.css'],
    standalone: true,
    imports: [
        NgIf
    ]
})
export class BackupDisplayTitle {
    @Input() selectedFile: FileInfoExtra;

    @Output() previousFile: EventEmitter<void> = new EventEmitter<void>();
    @Output() nextFile: EventEmitter<void> = new EventEmitter<void>();
    @Output() refresh: EventEmitter<FileInfoExtra> = new EventEmitter<FileInfoExtra>();
    @Output() deleteFile: EventEmitter<FileInfoExtra> = new EventEmitter<FileInfoExtra>();
    @Output() printFile: EventEmitter<FileInfoExtra> = new EventEmitter<FileInfoExtra>();
    @Output() downloadFile: EventEmitter<void> = new EventEmitter<void>();
    @Output() openInBrowser: EventEmitter<void> = new EventEmitter<void>();
    @Output() editDate: EventEmitter<void> = new EventEmitter<void>();
    @Output() editLocation: EventEmitter<void> = new EventEmitter<void>();
    @Output() zoom: EventEmitter<boolean> = new EventEmitter<boolean>();

    previous() {
        this.previousFile.emit();
    }

    next() {
        this.nextFile.emit();
    }

    refreshData() {
        this.refresh.emit(this.selectedFile);
    }

    delete() {
        this.deleteFile.emit(this.selectedFile);
    }

    print() {
        this.printFile.emit(this.selectedFile);
    }

    download() {
        this.downloadFile.emit();
    }

    openBrowser() {
        this.openInBrowser.emit();
    }

    isBrowserFile(): boolean {
        return this.selectedFile?.file?.browser === true;
    }

    triggerEditDate() {
        this.editDate.emit();
    }

    triggerEditLocation() {
        this.editLocation.emit();
    }

    displayZoom(): boolean {
        return this.selectedFile.file.image || this.selectedFile.file.video;
    }

    zoomIn() {
        this.zoom.emit(true);
    }

    zoomOut() {
        this.zoom.emit(false);
    }
}
