import {Component} from "@angular/core";
import {ActionGridData} from "./action-grid-data";

@Component({
    selector: 'jbr-action-data-size',
    templateUrl: './action-grid-data-size.html',
    styleUrls: ['./action-grid-data.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridDataSize extends ActionGridData {
    getText(): string {
        if(this.action && this.action.fileSize) {
            return "" + this.action.fileSize;
        }

        return "";
    }
}
