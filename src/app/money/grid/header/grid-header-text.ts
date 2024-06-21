import {Component, Input} from "@angular/core";

@Component({
    selector: 'jbr-grid-header-text',
    templateUrl: './grid-header-text.html',
    styleUrls: ['./grid-header-text.css'],
    standalone: true
})
export class GridHeaderText {
    @Input() header: String;
}
