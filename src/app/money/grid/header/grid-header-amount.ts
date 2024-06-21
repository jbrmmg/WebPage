import {Component, Input} from "@angular/core";

@Component({
    selector: 'jbr-grid-header-amount',
    templateUrl: './grid-header-amount.html',
    styleUrls: ['./grid-header-amount.css'],
    standalone: true
})
export class GridHeaderAmount {
    @Input() header: String;
}
