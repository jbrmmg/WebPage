import {Component, Input} from "@angular/core";

@Component({
    selector: 'jbr-grid-header-category',
    templateUrl: './grid-header-category.html',
    styleUrls: ['./grid-header-category.css'],
    standalone: true
})
export class GridHeaderCategory {
    @Input() header: String;
}
