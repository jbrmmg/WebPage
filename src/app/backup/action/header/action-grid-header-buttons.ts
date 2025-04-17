import {Component} from "@angular/core";
import {ActionGridHeader} from "./action-grid-header";

@Component({
    selector: 'jbr-action-header-buttons',
    templateUrl: './action-grid-header-buttons.html',
    styleUrls: ['./action-grid-header.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridHeaderButtons extends ActionGridHeader {
    getText(): string {
        return "";
    }
}
