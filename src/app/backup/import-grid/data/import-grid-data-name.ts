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
        if(this.file.similarFiles != null && this.file.similarFiles.length > 0) {
            return this.file.filename + " yes";
        }

        return this.file.filename;
    }
}
