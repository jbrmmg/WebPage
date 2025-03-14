import {NgIf} from "@angular/common";
import {Component} from "@angular/core";
import {ImportGridData} from "./import-grid-data";

@Component({
    selector: 'jbr-import-grid-data-size',
    templateUrl: './import-grid-data-size.html',
    styleUrls: ['./import-grid-data-size.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class ImportGridDataSize extends ImportGridData {
    getClass(parent: boolean): string {
        if(this.file && this.file.similar && this.file.source && this.file.source.size && this.file.similar.size && this.file.source.size != this.file.similar.size) {
            return parent ? "parent mis-match" : "child mis-match";
        }

        return parent ? "parent" : "child";
    }

    getText(): string {
        if(this.file && this.file.similar) {
            if(this.file.similar.size) {
                return this.file.similar.size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

            return "";
        }

        if(this.file && this.file.source) {
            return this.file.source.size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        return "";
    }
}
