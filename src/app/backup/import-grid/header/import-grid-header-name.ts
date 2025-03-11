import {NgIf} from "@angular/common";
import {Component} from "@angular/core";
import {ImportGridHeader} from "./import-grid-header";

@Component({
    selector: 'jbr-import-grid-header-name',
    templateUrl: './import-grid-header-name.html',
    styleUrls: ['./import-grid-header-name.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class ImportGridHeaderName extends ImportGridHeader {
    getText(): string {
        return "Name";
    }
}
