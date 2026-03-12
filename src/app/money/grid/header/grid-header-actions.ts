import {Component, Input} from '@angular/core';

@Component({
    selector: 'jbr-grid-header-actions',
    templateUrl: './grid-header-actions.html',
    styleUrls: ['./grid-header-actions.css'],
    standalone: true
})
export class GridHeaderActions {
    @Input() header: string;
}
