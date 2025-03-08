import {NgIf} from "@angular/common";
import {Component} from "@angular/core";
import {ImportGridData} from "./import-grid-data";

@Component({
    selector: 'jbr-import-grid-data-md5',
    templateUrl: './import-grid-data-md5.html',
    styleUrls: ['./import-grid-data-md5.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class ImportGridDataMd5 extends ImportGridData {

    getText(): string {
        if(this.file != null && this.file.md5 != null) {
            return this.file.md5;
        }

        return "";
    }
}
