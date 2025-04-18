import {Component} from "@angular/core";
import {SummaryGridHeader} from "./summary-grid-header";

@Component({
    selector: 'jbr-summary-grid-head-location',
    templateUrl: './summary-grid-header-location.html',
    styleUrls: ['./summary-grid-header.css'],
    imports: [
    ],
    standalone: true
})
export class SummaryGridHeaderLocation extends SummaryGridHeader{
    getText(): string {
        return "Location";
    }
}
