import {Component} from "@angular/core";
import {ActionGridHeader} from "./action-grid-header";

@Component({
    selector: 'jbr-action-header-video',
    templateUrl: './action-grid-header-video.html',
    styleUrls: ['./action-grid-header.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridHeaderVideo extends ActionGridHeader {
    getText(): string {
        return "Video";
    }
}
