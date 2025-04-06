import {NgIf} from "@angular/common";
import {Component, Input} from "@angular/core";
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
    @Input() importValue: boolean = false;

    getText(): string {
        if(this.file && this.file.source) {
            if(this.importValue) {
                if(this.file.source.importName) {
                    return this.file.source.importName;
                }
            } else {
                if(this.file.source.filename) {
                    return this.file.source.filename;
                }
            }
        }

        return "";
    }

    getClass() {
        return this.importValue ? "import-name" : "name";
    }
}
