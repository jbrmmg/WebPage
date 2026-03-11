import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {Map} from '../../map/map';
import {ImportGridFileDisplay} from '../import-grid-file-display';
import {LatLong} from '../../map/map-latlong';
import {ImportSelectedImage} from './import-selected-image';
import {ImportSelectedData} from './import-selected-data';
import {ImportSelectedAction} from './import-selected-action';
import {FileDestinationUpdate} from '../import-grid-update-destination';

@Component({
    selector: 'import-selected',
    templateUrl: './import-selected.html',
    standalone: true,
    imports: [
        Map,
        ImportSelectedImage,
        ImportSelectedData
    ],
    styleUrls: ['./import-selected.css']
})
export class ImportSelected {
    @ViewChild('map') map: Map;
    @ViewChild('image') image: ImportSelectedImage;
    @ViewChild('data') data: ImportSelectedData;

    @Output() actionEvent: EventEmitter<ImportSelectedAction> = new EventEmitter();

    selectionChangeMap(file: ImportGridFileDisplay) {
        if (file?.source?.location) {
            this.map.move(file.source.location);
            return;
        }

        // Move to a default
        const defaultLocation: LatLong = new LatLong();
        defaultLocation.lat = 51.60146388888889;
        defaultLocation.long = -0.37789999999999996;

        this.map.move(defaultLocation);
    }

    selectionChangeImage(file: ImportGridFileDisplay) {
        if (file?.source) {
            this.image.display(file);
            return;
        }

        // Move to a default
        this.image.clear();
    }

    selectionChangeData(file: ImportGridFileDisplay) {
        if (file?.source) {
            this.data.display(file);
            return;
        }

        // Move to a default
        this.data.clear();
    }

    selectionChange(file: ImportGridFileDisplay) {
        this.selectionChangeMap(file);
        this.selectionChangeImage(file);
        this.selectionChangeData(file);
    }

    previous(file: string) {
        this.actionEvent.emit(new ImportSelectedAction(file, 'previous', null));
    }

    next(file: string) {
        this.actionEvent.emit(new ImportSelectedAction(file, 'next', null));
    }

    deleteFile(file: string) {
        this.actionEvent.emit(new ImportSelectedAction(file, 'delete', null));
    }

    recipe(file: string) {
        this.actionEvent.emit(new ImportSelectedAction(file, 'recipe', null));
    }

    basicBackup(file: string) {
        this.actionEvent.emit(new ImportSelectedAction(file, 'backup', null));
    }

    ignore(file: string) {
        this.actionEvent.emit(new ImportSelectedAction(file, 'ignore', null));
    }

    unIgnore(file: string) {
        this.actionEvent.emit(new ImportSelectedAction(file, 'un-ignore', null));
    }

    updateDestination(update: FileDestinationUpdate) {
        this.actionEvent.emit(new ImportSelectedAction(update.filename, 'update-destination', update.destination));
    }
}
