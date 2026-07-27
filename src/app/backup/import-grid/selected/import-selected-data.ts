import {Component, EventEmitter, Output} from '@angular/core';
import {ImportGridFileDisplay} from '../import-grid-file-display';
import {LatLong} from '../../map/map-latlong';
import {ImageSize} from '../import-grid-imagesize';
import {IImportGridFileBase} from '../import-grid-file-base';
import {ImportSelectedDataSimilar} from './import-selected-data-similar';
import {NgForOf} from '@angular/common';
import {StepStatusType, TrafficLightType} from '../traffic/import-grid-traffic-light';
import {FormsModule} from '@angular/forms';
import {FileDestinationUpdate} from '../import-grid-update-destination';

@Component({
    selector: 'import-selected-data',
    templateUrl: './import-selected-data.html',
    standalone: true,
    imports: [
        ImportSelectedDataSimilar,
        NgForOf,
        FormsModule
    ],
    styleUrls: ['./import-selected-data.css']
})
export class ImportSelectedData {
    @Output() previousEvent: EventEmitter<string> = new EventEmitter();
    @Output() nextEvent: EventEmitter<string> = new EventEmitter();
    @Output() deleteEvent: EventEmitter<string> = new EventEmitter();
    @Output() recipeEvent: EventEmitter<string> = new EventEmitter();
    @Output() ignoreEvent: EventEmitter<string> = new EventEmitter();
    @Output() unIgnoreEvent: EventEmitter<string> = new EventEmitter();
    @Output() backupEvent: EventEmitter<string> = new EventEmitter();
    @Output() destinationUpdateEvent: EventEmitter<FileDestinationUpdate> = new EventEmitter();

    destination: string;
    filename: string;
    importFilename: string;
    location: LatLong;
    imageSize: ImageSize;
    date: string;
    size: string;
    md5: string;
    importDate: string;
    importSize: string;
    importMd5: string;
    similar: IImportGridFileBase[];
    stepStatus: StepStatusType;

    constructor() {
    }

    getText(): string {
        if (this.filename) {
            return this.filename;
        }

        return '';
    }

    getImportName() {
        if (this.importFilename) {
            return this.importFilename;
        }

        return '';
    }

    getLatLong(): string {
        if (this.location) {
            return '' + this.location.lat + ' ' + this.location.long;
        }

        return '';
    }

    getImageSize(): string {
        if (this.imageSize) {
            return '' + this.imageSize.width + ' x ' + this.imageSize.height;
        }

        return '';
    }

    getFileSize() {
        return this.size;
    }

    getImportSize() {
        if (this.importSize) {
            return this.importSize;
        }

        return '';
    }

    getFileDate() {
        if (this.date) {
            return this.date;
        }

        return '';
    }

    getImportDate() {
        if (this.importDate) {
            return this.importDate;
        }

        return '';
    }

    getMD5() {
        if (this.md5) {
            return this.md5;
        }

        return '';
    }

    getImportMd5() {
        if (this.importMd5) {
            return this.importMd5;
        }

        return '';
    }

    display(file: ImportGridFileDisplay) {
        console.log('🔄 Data update');
        if (file?.source) {
            this.filename = file.source.filename;
            this.imageSize = file.source.imageSize;
            this.location = file.source.location;
            this.similar = file.source.similarFiles;
            this.destination = '';
            if (file.source.destination) {
                this.destination = file.source.destination;
            }
            this.date = '';
            if (file.source.date) {
                this.date = file.source.date.replaceAll('T', ' ');
            }
            this.size = '';
            if (file.source.size) {
                this.size = file.source.size.toLocaleString('en-US');
            }
            this.md5 = file.source.md5;

            this.importFilename = '';
            if (file.source.importName && file.source.importName !== this.filename) {
                this.importFilename = file.source.importName;
            }

            this.importSize = '';
            if (file.source.importSize && file.source.importSize !== file.source.size) {
                this.importSize = file.source.importSize.toLocaleString('en-US');
            }

            this.importDate = '';
            if (file.source.importDate && file.source.importDate !== file.source.date) {
                this.importDate = file.source.importDate.replaceAll('T', ' ');
            }

            this.importMd5 = '';
            if (file.source.importMd5 && file.source.importMd5 !== file.source.md5) {
                this.importMd5 = file.source.importMd5;
            }

            this.stepStatus = file.source.stepStatus;

            return;
        }

        this.clear();
    }

    clear() {
        this.filename = '';
        this.imageSize = null;
        this.location = null;
        this.similar = [];
        this.date = '';
        this.size = '';
        this.md5 = '';
    }

    previous() {
        this.previousEvent.emit(this.filename);
    }

    next() {
        this.nextEvent.emit(this.filename);
    }

    delete() {
        this.deleteEvent.emit(this.filename);
    }

    ignore() {
        if (this.stepStatus?.checkFileIgnored && this.stepStatus.checkFileIgnored === 'RED') {
            return this.unIgnoreEvent.emit(this.filename);
        }

        this.ignoreEvent.emit(this.filename);
    }

    recipe() {
        this.recipeEvent.emit(this.filename);
    }

    backup() {
        this.backupEvent.emit(this.filename);
    }

    getSteps(): number[] {
        const result: number[] = [];

        for (const step in TrafficLightType) {
            if (!Number.isNaN(Number(step))) {
                result.push(Number(step));
            }
        }

        return result;
    }

    getStatusText(step: TrafficLightType): string {
        switch (step) {
            case TrafficLightType.readPreImportFile:
                return 'Read';
            case TrafficLightType.gatherMetaData:
                return 'Meta';
            case TrafficLightType.copyFileToImport:
                return 'Copy';
            case TrafficLightType.checkFileIgnored:
                return 'Ignore';
            case TrafficLightType.checkActivePhotoFile:
                return 'Active';
            case TrafficLightType.checkDuplicateFile:
                return 'Duplicate';
            case TrafficLightType.checkFileConfirmedImported:
                return 'Imported';
            case TrafficLightType.processImport:
                return 'Process';
            case TrafficLightType.completed:
                return 'Complete';
        }
    }

    getStepStatusClass(status: string): string {
        switch (status) {
            case 'RED':
                return 'red';
            case 'AMBER':
                return 'amber';
            case 'GREEN':
                return 'green';
        }
        return 'unknown';
    }

    getStatusClass(step: TrafficLightType) {
        switch (step) {
            case TrafficLightType.readPreImportFile:
                if (this.stepStatus?.readPreImportFile) {
                    return this.getStepStatusClass(this.stepStatus.readPreImportFile);
                }
                return 'unknown';
            case TrafficLightType.gatherMetaData:
                if (this.stepStatus?.gatherMetaData) {
                    return this.getStepStatusClass(this.stepStatus.gatherMetaData);
                }
                return 'unknown';
            case TrafficLightType.copyFileToImport:
                if (this.stepStatus?.copyFileToImport) {
                    return this.getStepStatusClass(this.stepStatus.copyFileToImport);
                }
                return 'unknown';
            case TrafficLightType.checkFileIgnored:
                if (this.stepStatus?.checkFileIgnored) {
                    return this.getStepStatusClass(this.stepStatus.checkFileIgnored);
                }
                return 'unknown';
            case TrafficLightType.checkActivePhotoFile:
                if (this.stepStatus?.checkActivePhotoFile) {
                    return this.getStepStatusClass(this.stepStatus.checkActivePhotoFile);
                }
                return 'unknown';
            case TrafficLightType.checkDuplicateFile:
                if (this.stepStatus?.checkDuplicateFile) {
                    return this.getStepStatusClass(this.stepStatus.checkDuplicateFile);
                }
                return 'unknown';
            case TrafficLightType.checkFileConfirmedImported:
                if (this.stepStatus?.checkFileConfirmedImported) {
                    return this.getStepStatusClass(this.stepStatus.checkFileConfirmedImported);
                }
                return 'unknown';
            case TrafficLightType.processImport:
                if (this.stepStatus?.processImport) {
                    return this.getStepStatusClass(this.stepStatus.processImport);
                }
                return 'unknown';
            case TrafficLightType.completed:
                if (this.stepStatus?.completed) {
                    return this.getStepStatusClass(this.stepStatus.completed);
                }
                return 'unknown';
        }
    }

    getIgnoreButtonLabelClass(): string {
        if (this.stepStatus?.checkFileIgnored && this.stepStatus.checkFileIgnored === 'RED') {
            return 'btn btn-outline-success';
        }
        return 'btn btn-outline-danger';
    }

    getIgnoreButtonClass(): string {
        if (this.stepStatus?.checkFileIgnored && this.stepStatus.checkFileIgnored === 'RED') {
            return 'fa fa-plus-circle';
        }

        return 'fa fa-minus-circle';
    }

    getIgnoreButtonTitle(): string {
        if (this.stepStatus?.checkFileIgnored && this.stepStatus.checkFileIgnored === 'RED') {
            return 'Remove the ignore flag on this file.';
        }

        return 'Mark this photo to be ignored.';
    }

    enterDestination() {
        this.destinationUpdateEvent.emit(new FileDestinationUpdate(this.filename, this.destination));
    }
}
