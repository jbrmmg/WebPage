import {Component} from '@angular/core';
import {SummaryGridHeader} from './summary-grid-header';

@Component({
    selector: 'jbr-summary-grid-head-files',
    templateUrl: './summary-grid-header-files.html',
    styleUrls: ['./summary-grid-header.css'],
    imports: [
    ],
    standalone: true
})
export class SummaryGridHeaderFiles extends SummaryGridHeader {
    getText(): string {
        return 'Files';
    }
}
