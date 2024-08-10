import {Component} from "@angular/core";
import {NgIf} from "@angular/common";
import {GridData} from "./grid-data";

@Component({
    selector: 'jbr-grid-data-statement',
    templateUrl: './grid-data-statement.html',
    styleUrls: ['./grid-data-statement.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class GridDataStatement extends GridData {
}
