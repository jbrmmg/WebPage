import {Component, Input} from "@angular/core";

@Component({
    selector: 'jbr-grid-header-select',
    templateUrl: './grid-header-select.html',
    styleUrls: ['./grid-header-select.css'],
    standalone: true
})
export class GridHeaderSelect {
    @Input() header: string;
}
