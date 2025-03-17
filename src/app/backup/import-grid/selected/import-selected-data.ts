import {Component, EventEmitter, Output} from '@angular/core';
import {ImportGridFileDisplay} from "../import-grid-file-display";
import {LatLong} from "../import-grid-latlong";
import {ImageSize} from "../import-grid-imagesize";
import {IImportGridFileBase} from "../import-grid-file-base";
import {ImportSelectedDataSimilar} from "./import-selected-data-similar";

@Component({
    selector: 'import-selected-data',
    templateUrl: './import-selected-data.html',
    standalone: true,
    imports: [
        ImportSelectedDataSimilar
    ],
    styleUrls: ['./import-selected-data.css']
})
export class ImportSelectedData {
    @Output() previousEvent: EventEmitter<String> = new EventEmitter();
    @Output() nextEvent: EventEmitter<String> = new EventEmitter();
    @Output() deleteEvent: EventEmitter<String> = new EventEmitter();

    filename: string;
    location: LatLong;
    imageSize: ImageSize;
    date: string;
    size: string;
    md5: string;
    similar: IImportGridFileBase[];

    constructor() {
    }

    getText(): string {
        if(this.filename) {
            return this.filename;
        }

        return "";
    }

    getLat(): string {
        if(this.location) {
            return "" + this.location.lat;
        }

        return "";
    }

    getLong(): string {
        if(this.location) {
            return "" + this.location.long;
        }

        return "";
    }

    getImageWidth(): string {
        if(this.imageSize) {
            return "" + this.imageSize.width;
        }

        return "";
    }

    getImageHeight(): string {
        if(this.imageSize) {
            return "" + this.imageSize.height;
        }

        return "";
    }

    getFileSize() {
        return this.size;
    }

    getFileDate() {
        if(this.date) {
            return this.date;
        }

        return "";
    }

    getMD5() {
        if(this.md5) {
            return this.md5;
        }

        return "";
    }

    display(file: ImportGridFileDisplay) {
        console.log("data update");
        if(file && file.source) {
            this.filename = file.source.filename;
            this.imageSize = file.source.imageSize;
            this.location = file.source.location;
            this.similar = file.source.similarFiles;
            this.date = "";
            if(file.source.date) {
                this.date = file.source.date.replace("T", " ");
            }
            this.size = "";
            if(file.source.size) {
                this.size = file.source.size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            this.md5 = file.source.md5;
            return;
        }

        this.clear();
    }

    clear() {
        this.filename = "";
        this.imageSize = null;
        this.location = null;
        this.similar = [];
        this.date = "";
        this.size = "";
        this.md5 = "";
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
}
