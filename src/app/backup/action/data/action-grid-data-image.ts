import {Component} from "@angular/core";
import {ActionGridData} from "./action-grid-data";

@Component({
    selector: 'jbr-action-data-image',
    templateUrl: './action-grid-data-image.html',
    styleUrls: ['./action-grid-data.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridDataImage extends ActionGridData {
    getText(): string {
        if(this.action && this.action.isImage) {
            return "" + this.action.isImage;
        }

        return "";
    }
}
