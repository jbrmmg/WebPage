import {Component, Input} from "@angular/core";
import {ImportGridHeader} from "./import-grid-header";

@Component({
    selector: 'jbr-import-grid-header-date',
    templateUrl: './import-grid-header-date.html',
    styleUrls: ['./import-grid-header-date.css'],
    imports: [],
    standalone: true
})

export class ImportGridHeaderDate extends ImportGridHeader {
    @Input() importValue: boolean = false;

    getText(): string {
        return this.importValue ? "Import Date" : "Date";
    }
}
