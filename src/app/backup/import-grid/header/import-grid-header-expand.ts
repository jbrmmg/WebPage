import {NgIf} from "@angular/common";
import {Component} from "@angular/core";
import {ImportGridHeader} from "./import-grid-header";

@Component({
    selector: 'jbr-import-grid-header-expand',
    templateUrl: './import-grid-header-expand.html',
    styleUrls: ['./import-grid-header-expand.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class ImportGridHeaderExpand extends ImportGridHeader {
    getText(): string {
        return "";
    }
}
