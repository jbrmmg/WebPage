import {Component, Input} from "@angular/core";
import {GridHeader} from "./grid-header";

@Component({
    selector: 'jbr-grid-header-category',
    templateUrl: './grid-header-category.html',
    styleUrls: ['./grid-header-category.css'],
    standalone: true
})
export class GridHeaderCategory extends GridHeader {
    @Input() header: string;
}
