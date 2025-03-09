import {NgIf} from "@angular/common";
import {Component} from "@angular/core";
import {ImportGridData} from "./import-grid-data";

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

    getText(): string {
        if(this.file != null && this.file.md5 != null) {
            return this.file.md5;
        }

        return "";
    }
}
