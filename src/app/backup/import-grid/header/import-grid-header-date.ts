import {NgIf} from "@angular/common";
import {Component} from "@angular/core";
import {ImportGridHeader} from "./import-grid-header";

@Component({
    selector: 'jbr-import-grid-header-date',
    templateUrl: './import-grid-header-date.html',
    styleUrls: ['./import-grid-header-date.css'],
    imports: [
        NgIf
    ],
    standalone: true
})

export class ImportGridHeaderDate extends ImportGridHeader {
    getText(): string {
        return "Date";
    }
}
