import {NgIf} from "@angular/common";
import {Component, Input} from "@angular/core";
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
    @Input() importValue: boolean = false;

    getText(): string {
        if(this.file && this.file.source && this.file.source.size) {
            if(this.importValue) {
                if(this.file.source.importSize) {
                    return this.file.source.importSize.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
            } else {
                if(this.file.source.size) {
                    return this.file.source.size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
            }
        }

        return "";
    }
}
