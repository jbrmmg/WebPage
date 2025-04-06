import {NgIf} from "@angular/common";
import {Component, Input} from "@angular/core";
import {ImportGridHeader} from "./import-grid-header";

@Component({
    selector: 'jbr-import-grid-header-md5',
    templateUrl: './import-grid-header-md5.html',
    styleUrls: ['./import-grid-header-md5.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class ImportGridHeaderMd5 extends ImportGridHeader {
    @Input() importValue: boolean = false;

    getText(): string {
        return this.importValue ? "Import MD5" : "MD5";
    }
}
