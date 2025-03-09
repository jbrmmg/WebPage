import {NgIf} from "@angular/common";
import {Component} from "@angular/core";
import {ImportGridData} from "./import-grid-data";

@Component({
    selector: 'jbr-import-grid-data-name',
    templateUrl: './import-grid-data-name.html',
    styleUrls: ['./import-grid-data-name.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class ImportGridDataName extends ImportGridData {

    getText(): string {
        if(this.file && this.file.similarFiles && this.file.similarFiles.length > 0) {
            return this.file.filename + " (" + this.file.similarFiles.length + ")";
        }

        if(this.file) {
            return this.file.filename;
        }

        return "";
    }
}
