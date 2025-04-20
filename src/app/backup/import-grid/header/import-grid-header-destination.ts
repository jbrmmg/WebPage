import {Component} from "@angular/core";
import {ImportGridHeader} from "./import-grid-header";

@Component({
    selector: 'jbr-import-grid-header-destination',
    templateUrl: './import-grid-header-destination.html',
    styleUrls: ['./import-grid-header-destination.css'],
    imports: [],
    standalone: true
})
export class ImportGridHeaderDestination extends ImportGridHeader {
    getText(): string {
        return "Destination";
    }
}
