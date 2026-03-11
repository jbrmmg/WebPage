import {Component} from "@angular/core";
import {SummaryGridData} from "./summary-grid-data";
import {NgIf} from "@angular/common";

@Component({
    selector: 'jbr-summary-grid-data-destination',
    templateUrl: './summary-grid-data-destination.html',
    styleUrls: ['./summary-grid-data.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class SummaryGridDataDestination extends SummaryGridData {
    getText(): string {
        if(this.source?.destinationId) {
            let result: string = "";
            this.summary.sources.forEach(b => {
                if(b.destinationId == this.source.destinationId) {
                    result = b.path;
                }
            });
            return result;
        }

        return "";
    }

    hasValue() {
        return this.source?.destinationId;
    }
}
