import {Component} from "@angular/core";
import {SummaryGridData} from "./summary-grid-data";

@Component({
    selector: 'jbr-summary-grid-data-largest',
    templateUrl: './summary-grid-data-largest.html',
    styleUrls: ['./summary-grid-data-largest.css'],
    imports: [
    ],
    standalone: true
})
export class SummaryGridDataLargest extends SummaryGridData {
    getText(): string {
        if(this.source && this.source.largestFile > 0) {
            return "" + this.source.largestFile
        }

        return "";
    }
}
