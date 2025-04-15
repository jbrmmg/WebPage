import {Component} from "@angular/core";
import {ActionGridData} from "./action-grid-data";

@Component({
    selector: 'jbr-action-data-name',
    templateUrl: './action-grid-data-name.html',
    styleUrls: ['./action-grid-data.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridDataName extends ActionGridData {
    getText(): string {
        if(this.action && this.action.fileName) {
            return this.action.fileName;
        }

        return "";
    }
}
