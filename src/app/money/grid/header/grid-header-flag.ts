import {Component, Input} from "@angular/core";

@Component({
    selector: 'jbr-grid-header-flag',
    templateUrl: './grid-header-flag.html',
    styleUrls: ['./grid-header-flag.css'],
    standalone: true
})
export class GridHeaderFlag {
    @Input() header: String;
}
