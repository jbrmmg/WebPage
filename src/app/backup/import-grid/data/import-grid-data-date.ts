import {NgIf} from "@angular/common";
import {Component} from "@angular/core";
import {ImportGridData} from "./import-grid-data";

@Component({
    selector: 'jbr-import-grid-data-date',
    templateUrl: './import-grid-data-date.html',
    styleUrls: ['./import-grid-data-date.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class ImportGridDataDate extends ImportGridData {

    getText(): string {
        if(this.file && this.file.source && this.file.source.date) {
            return this.file.source.date.replace("T"," ");
        }

        return "";
    }
}
