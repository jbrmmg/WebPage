import {Component} from '@angular/core';
import {SummaryGridHeader} from './summary-grid-header';

@Component({
    selector: 'jbr-summary-grid-head-path',
    templateUrl: './summary-grid-header-path.html',
    styleUrls: ['./summary-grid-header.css'],
    imports: [
    ],
    standalone: true
})
export class SummaryGridHeaderPath extends SummaryGridHeader {
    getText(): string {
        return 'Path';
    }
}
