import {NgIf} from "@angular/common";
import {Component} from "@angular/core";
import {ImportGridHeader} from "./import-grid-header";

@Component({
    selector: 'jbr-import-grid-header-status',
    templateUrl: './import-grid-header-status.html',
    styleUrls: ['./import-grid-header-status.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class ImportGridHeaderStatus extends ImportGridHeader {
    getText(): string {
        return "Status";
    }
}
