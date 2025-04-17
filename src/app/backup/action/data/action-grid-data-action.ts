import {Component} from "@angular/core";
import {ActionGridData} from "./action-grid-data";

@Component({
    selector: 'jbr-action-data-action',
    templateUrl: './action-grid-data-action.html',
    styleUrls: ['./action-grid-data.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridDataAction extends ActionGridData {
    getText(): string {
        if(this.action && this.action.action) {
            return this.action.action;
        }

        return "";
    }
}
