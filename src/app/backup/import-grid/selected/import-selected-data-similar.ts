import {Component, Input} from '@angular/core';
import {IImportGridFileBase} from "../import-grid-file-base";
import {NgForOf, NgIf} from "@angular/common";

@Component({
    selector: 'import-selected-data-similar',
    templateUrl: './import-selected-data-similar.html',
    standalone: true,
    imports: [
        NgForOf,
        NgIf
    ],
    styleUrls: ['./import-selected-data-similar.css']
})
export class ImportSelectedDataSimilar {
    @Input() similar: IImportGridFileBase[];

    getSizeString(file: IImportGridFileBase) {
        let sizeString = "" + file.size;

        return sizeString.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}
