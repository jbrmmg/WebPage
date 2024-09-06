import {Component} from "@angular/core";
import {NgIf} from "@angular/common";
import {GridData} from "./grid-data";

@Component({
    selector: 'jbr-grid-data-predicted',
    templateUrl: './grid-data-predicted.html',
    styleUrls: ['./grid-data-predicted.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class GridDataPredicted extends GridData {
}
