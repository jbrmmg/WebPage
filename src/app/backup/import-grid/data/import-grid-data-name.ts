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
        if(this.file && this.file.similar) {
            return this.file.similar.filename;
        }

        if(this.file && this.file.source) {
            return this.file.source.filename;
        }

        return "";
    }

    getClassName() {
        if(this.file && this.file.similar == null) {
            return "name";
        }

        return "similar-name";
    }
}
