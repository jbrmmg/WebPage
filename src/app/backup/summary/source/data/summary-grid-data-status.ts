import {Component} from "@angular/core";
import {SummaryGridData} from "./summary-grid-data";

@Component({
    selector: 'jbr-summary-grid-data-status',
    templateUrl: './summary-grid-data-status.html',
    styleUrls: ['./summary-grid-data-status.css'],
    imports: [
    ],
    standalone: true
})
export class SummaryGridDataStatus extends SummaryGridData {
    getText(): string {
        if(this.source) {
            return this.source.status;
        }

        return "unknown";
    }
}
