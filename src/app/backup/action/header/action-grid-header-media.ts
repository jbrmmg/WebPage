import {Component} from "@angular/core";
import {ActionGridHeader} from "./action-grid-header";

@Component({
    selector: 'jbr-action-header-media',
    templateUrl: './action-grid-header-media.html',
    styleUrls: ['./action-grid-header.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridHeaderMedia extends ActionGridHeader {
    getText(): string {
        return "Details";
    }
}
