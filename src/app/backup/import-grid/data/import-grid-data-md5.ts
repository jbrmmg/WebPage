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
    getClass(): string {
        if(this.file && this.file.similar && this.file.source && this.file.source.md5 && this.file.similar.md5 && this.file.source.md5 != this.file.similar.md5) {
            return "md5 mis-match";
        }

        return "md5";
    }

    getText(): string {
        if(this.file && this.file.similar) {
            if(this.file.similar.md5) {
                return this.file.similar.md5;
            }

            return "";
        }

        if(this.file != null && this.file.source && this.file.source.md5 != null) {
            return this.file.source.md5;
        }

        return "";
    }
}
