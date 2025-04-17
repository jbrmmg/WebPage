import {Component} from "@angular/core";
import {ActionGridData} from "./action-grid-data";

@Component({
    selector: 'jbr-action-data-buttons',
    templateUrl: './action-grid-data-buttons.html',
    styleUrls: ['./action-grid-data.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridDataButtons extends ActionGridData {
    getText(): string {
        return "put btn here";
    }
}
