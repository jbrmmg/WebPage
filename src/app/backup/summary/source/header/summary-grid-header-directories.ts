import {Component} from '@angular/core';
import {SummaryGridHeader} from './summary-grid-header';

@Component({
    selector: 'jbr-summary-grid-head-directories',
    templateUrl: './summary-grid-header-directories.html',
    styleUrls: ['./summary-grid-header.css'],
    imports: [
    ],
    standalone: true
})
export class SummaryGridHeaderDirectories extends SummaryGridHeader {
    getText(): string {
        return 'Directories';
    }
}
