import {NgIf} from "@angular/common";
import {Component, EventEmitter, Output} from "@angular/core";
import {ImportGridData} from "./import-grid-data";
import {ImportGridFileDisplay} from "../import-grid-file-display";

@Component({
    selector: 'jbr-import-grid-data-expand',
    templateUrl: './import-grid-data-expand.html',
    styleUrls: ['./import-grid-data-expand.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class ImportGridDataExpand extends ImportGridData {
    @Output() fireExpand: EventEmitter<ImportGridFileDisplay> = new EventEmitter();

    expand() {
        this.fireExpand.emit(this.file)
    }

    getText(): string {
        return "";
    }

    expandStatus(): string {
        if(this.file && this.file.expanded) {
            return "selected"
        }

        return "not-selected"
    }
}
