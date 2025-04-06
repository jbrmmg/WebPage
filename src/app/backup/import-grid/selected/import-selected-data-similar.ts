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
    @Input() name: string;
    @Input() date: string;
    @Input() size: string;
    @Input() md5: string;
    @Input() importName: string;
    @Input() importDate: string;
    @Input() importSize: string;
    @Input() importMd5: string;

    getSizeString(file: IImportGridFileBase) {
        return file.size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    getNameClass(file: IImportGridFileBase): string {
        if(file.filename && this.name) {
            if(file.filename.toLowerCase().includes(this.name.toLowerCase())) {
                return "";
            }

            if(this.importName) {
                if(file.filename.toLowerCase().includes(this.importName.toLowerCase())) {
                    return "";
                }
            }
        }

        return "mismatch";
    }

    getDateClass(file: IImportGridFileBase): string {
        if(file.date && this.date && this.importDate) {
            if(file.date.replace("T"," ") != this.date && file.date.replace("T"," ")  != this.importDate) {
                return "mismatch";
            }
        }

        return "";
    }

    getSizeClass(file: IImportGridFileBase): string {
        let fileSize: string = file.size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if(fileSize != this.size && fileSize != this.importSize) {
            return "mismatch";
        }

        return "";
    }

    getMd5Class(file: IImportGridFileBase): string {
        if(file.md5) {
            if(file.md5 != this.md5 && file.md5 != this.importMd5) {
                return "md5 mismatch";
            }
        }

        return "md5";
    }

    getDate(file: IImportGridFileBase) {
        return file.date.substring(0,10);
    }

    getTime(file: IImportGridFileBase) {
        return file.date.substring(11);
    }
}
