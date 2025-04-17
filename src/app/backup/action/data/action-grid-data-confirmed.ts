import {Component} from "@angular/core";
import {ActionGridData} from "./action-grid-data";

@Component({
    selector: 'jbr-action-data-confirmed',
    templateUrl: './action-grid-data-confirmed.html',
    styleUrls: ['./action-grid-data.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridDataConfirmed extends ActionGridData {
    getText(): string {
        if(this.action && this.action.confirmed) {
            return "" + this.action.confirmed;
        }

        return "";
    }
}
