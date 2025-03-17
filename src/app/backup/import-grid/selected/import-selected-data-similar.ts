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
    @Input() date: string;
    @Input() size: string;
    @Input() md5: string;

    getSizeString(file: IImportGridFileBase) {
        return file.size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    getDateClass(file: IImportGridFileBase): string {
        return file.date.replace("T"," ") == this.date.replace("T"," ") ? "" : "mismatch";
    }

    getSizeClass(file: IImportGridFileBase): string {
        return file.size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") == this.size ? "" : "mismatch";
    }

    getMd5Class(file: IImportGridFileBase): string {
        return file.md5 == this.md5 ? "" : "mismatch";
    }
}
