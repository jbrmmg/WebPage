import {Component} from '@angular/core';
import {SummaryGridData} from './summary-grid-data';
import {NgIf} from '@angular/common';

@Component({
    selector: 'jbr-summary-grid-data-status',
    templateUrl: './summary-grid-data-status.html',
    styleUrls: ['./summary-grid-data.css'],
    imports: [NgIf],
    standalone: true
})
export class SummaryGridDataStatus extends SummaryGridData {
    getText(): string {
        return this.source?.status ?? 'unknown';
    }
}
