import {Component, Input} from "@angular/core";
import {ImportGridData} from "./import-grid-data";

@Component({
    selector: 'jbr-import-grid-data-date',
    templateUrl: './import-grid-data-date.html',
    styleUrls: ['./import-grid-data-date.css'],
    imports: [],
    standalone: true
})
export class ImportGridDataDate extends ImportGridData {
    @Input() importValue: boolean = false;

    getText(): string {
        if(this.file && this.file.source) {
            if(this.importValue) {
                if(this.file.source.importDate) {
                    return this.file.source.importDate.substring(0,10);
                }
            } else {
                if(this.file.source.date) {
                    return this.file.source.date.substring(0,10);
                }
            }
        }

        return "";
    }

    getText2(): string {
        if(this.file && this.file.source) {
            if(this.importValue) {
                if(this.file.source.importDate) {
                    return this.file.source.importDate.substring(11);
                }
            } else {
                if(this.file.source.date) {
                    return this.file.source.date.substring(11);
                }
            }
        }

        return "";
    }
}
