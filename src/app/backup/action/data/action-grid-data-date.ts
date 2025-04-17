import {Component} from "@angular/core";
import {ActionGridData} from "./action-grid-data";

@Component({
    selector: 'jbr-action-data-date',
    templateUrl: './action-grid-data-date.html',
    styleUrls: ['./action-grid-data.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridDataDate extends ActionGridData {
    getText(): string {
        if(this.action && this.action.fileDate) {
            return "" + this.action.fileDate;
        }

        return "";
    }
}
