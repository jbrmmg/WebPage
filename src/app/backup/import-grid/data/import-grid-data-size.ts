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

    getText(): string {
        if(this.file && this.file.source) {
            return this.file.source.size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        return "";
    }
}
