import {NgIf} from "@angular/common";
import {Component, EventEmitter, Output} from "@angular/core";
import {ImportGridData} from "./import-grid-data";
import {ImportGridFileDisplay} from "../import-grid-file-display";

@Component({
    selector: 'jbr-import-grid-data-select',
    templateUrl: './import-grid-data-select.html',
    styleUrls: ['./import-grid-data-select.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class ImportGridDataSelect extends ImportGridData {
    @Output() select: EventEmitter<ImportGridFileDisplay> = new EventEmitter();

    selectFile() {
        this.select.emit(this.file)
    }

    getText(): string {
        return "";
    }

    selectStatus(): string {
        if(this.file && this.file.selected) {
            return "selected"
        }

        return "not-selected"
    }
}
