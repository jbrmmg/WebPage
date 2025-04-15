import {Component} from "@angular/core";
import {SummaryGridHeader} from "./summary-grid-header";

@Component({
    selector: 'jbr-summary-grid-head-destination',
    templateUrl: './summary-grid-header-destination.html',
    styleUrls: ['./summary-grid-header.css'],
    imports: [
    ],
    standalone: true
})
export class SummaryGridHeaderDestination extends SummaryGridHeader{
    getText(): string {
        return "Destination";
    }
}
