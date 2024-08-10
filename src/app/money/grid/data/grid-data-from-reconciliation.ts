import {Component} from "@angular/core";
import {NgIf} from "@angular/common";
import {GridData} from "./grid-data";

@Component({
    selector: 'jbr-grid-data-from-reconciliation',
    templateUrl: './grid-data-from-reconciliation.html',
    styleUrls: ['./grid-data-from-reconciliation.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class GridDataFromReconciliation extends GridData {
}
