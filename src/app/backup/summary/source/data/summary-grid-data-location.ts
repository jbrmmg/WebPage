import {Component} from '@angular/core';
import {SummaryGridData} from './summary-grid-data';

@Component({
    selector: 'jbr-summary-grid-data-location',
    templateUrl: './summary-grid-data-location.html',
    styleUrls: ['./summary-grid-data.css'],
    imports: [
    ],
    standalone: true
})
export class SummaryGridDataLocation extends SummaryGridData {
    getText(): string {
        if (this.source) {
            return this.source.location.name;
        }

        return 'unknown';
    }
}
