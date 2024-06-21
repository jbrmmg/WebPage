import {Component, Input} from "@angular/core";

@Component({
    selector: 'jbr-grid-header-statement-date',
    templateUrl: './grid-header-statement-date.html',
    styleUrls: ['./grid-header-statement-date.css'],
    standalone: true
})
export class GridHeaderStatementDate {
    @Input() header: string;
}
