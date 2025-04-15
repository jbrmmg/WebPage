import {Component} from "@angular/core";
import {SummaryGridHeader} from "./summary-grid-header";

@Component({
    selector: 'jbr-summary-grid-head-largest',
    templateUrl: './summary-grid-header-largest.html',
    styleUrls: ['./summary-grid-header-largest.css'],
    imports: [
    ],
    standalone: true
})
export class SummaryGridHeaderLargest extends SummaryGridHeader{
    getText(): string {
        return "Largest";
    }
}
