import {Component} from "@angular/core";
import {ImportGridData} from "./import-grid-data";

@Component({
    selector: 'jbr-import-grid-data-destination',
    templateUrl: './import-grid-data-destination.html',
    styleUrls: ['./import-grid-data-destination.css'],
    imports: [],
    standalone: true
})
export class ImportGridDataDestination extends ImportGridData {
    getText(): string {
        if(this.file?.source?.destination) {
            return this.file.source.destination;
        }

        return "";
    }
}
