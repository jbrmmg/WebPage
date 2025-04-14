import {Component} from "@angular/core";
import {SummaryGridData} from "./summary-grid-data";

@Component({
    selector: 'jbr-summary-grid-data-files',
    templateUrl: './summary-grid-data-files.html',
    styleUrls: ['./summary-grid-data-files.css'],
    imports: [
    ],
    standalone: true
})
export class SummaryGridDataFiles extends SummaryGridData {
    getText(): string {
        if(this.source && this.source.fileCount > 0) {
            return "" + this.source.fileCount
        }

        return "";
    }
}
