import {Component} from "@angular/core";
import {SummaryGridData} from "./summary-grid-data";

@Component({
    selector: 'jbr-summary-grid-data-directories',
    templateUrl: './summary-grid-data-directories.html',
    styleUrls: ['./summary-grid-data-directories.css'],
    imports: [
    ],
    standalone: true
})
export class SummaryGridDataDirectories extends SummaryGridData {
    getText(): string {
        if(this.source && this.source.directoryCount > 0) {
            return "" + this.source.directoryCount
        }

        return "";
    }
}
