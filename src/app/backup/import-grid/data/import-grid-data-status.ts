import {NgIf} from "@angular/common";
import {Component, EventEmitter, Output} from "@angular/core";
import {ImportGridData} from "./import-grid-data";

@Component({
    selector: 'jbr-import-grid-data-status',
    templateUrl: './import-grid-data-status.html',
    styleUrls: ['./import-grid-data-status.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class ImportGridDataStatus extends ImportGridData {
    @Output() delete: EventEmitter<String> = new EventEmitter();

    getText(): string {
        if(this.file && this.file.source) {
            return this.file.source.size + "";
        }

        return "";
    }

    statusText(): string {
        if(this.file && this.file.source) {
            return this.file.source.status;
        }

        return "";
    }

    deleteFile() {
        if(this.file && this.file.source && this.file.source.filename) {
            this.delete.emit(this.file.source.filename)
        }
    }
}
