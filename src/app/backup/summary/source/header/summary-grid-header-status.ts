import {Component} from "@angular/core";
import {SummaryGridHeader} from "./summary-grid-header";

@Component({
    selector: 'jbr-summary-grid-head-status',
    templateUrl: './summary-grid-header-status.html',
    styleUrls: ['./summary-grid-header.css'],
    imports: [
    ],
    standalone: true
})
export class SummaryGridHeaderStatus extends SummaryGridHeader {
    getText(): string {
        return "Status";
    }
}
