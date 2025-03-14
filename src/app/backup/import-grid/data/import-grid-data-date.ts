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
    getClass(parent: boolean): string {
        if(this.file && this.file.similar && this.file.source && this.file.source.date && this.file.similar.date && this.file.source.date != this.file.similar.date) {
            return parent ? "parent mis-match" : "child mis-match";
        }

        return parent ? "parent" : "child";
    }

    getText(): string {
        if(this.file && this.file.similar) {
            if(this.file.similar.date) {
                return this.file.similar.date.replace("T"," ");
            }

            return "";
        }

        if(this.file && this.file.source && this.file.source.date) {
            return this.file.source.date.replace("T"," ");
        }

        return "";
    }
}
