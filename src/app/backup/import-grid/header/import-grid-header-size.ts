import {NgIf} from "@angular/common";
import {Component} from "@angular/core";
import {ImportGridHeader} from "./import-grid-header";

@Component({
    selector: 'jbr-import-grid-header-size',
    templateUrl: './import-grid-header-size.html',
    styleUrls: ['./import-grid-header-size.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class ImportGridHeaderSize extends ImportGridHeader {
    getText(): string {
        return "Size";
    }
}
