import {Component} from '@angular/core';
import {SummaryGridData} from './summary-grid-data';
import {NgIf} from '@angular/common';

@Component({
    selector: 'jbr-summary-grid-data-path',
    templateUrl: './summary-grid-data-path.html',
    styleUrls: ['./summary-grid-data.css'],
    imports: [NgIf],
    standalone: true
})
export class SummaryGridDataPath extends SummaryGridData {
    getText(): string {
        if (this.source) {
            return this.source.path;
        }

        return 'unknown';
    }
}
