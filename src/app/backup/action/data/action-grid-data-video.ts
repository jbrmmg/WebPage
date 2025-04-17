import {Component} from "@angular/core";
import {ActionGridData} from "./action-grid-data";

@Component({
    selector: 'jbr-action-data-video',
    templateUrl: './action-grid-data-video.html',
    styleUrls: ['./action-grid-data.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridDataVideo extends ActionGridData {
    getText(): string {
        if(this.action && this.action.isVideo) {
            return "" + this.action.isVideo;
        }

        return "";
    }
}
