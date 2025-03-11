import {NgIf} from "@angular/common";
import {Component} from "@angular/core";
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
    getText(): string {
        return "MD5";
    }
}
