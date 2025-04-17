import {Component} from "@angular/core";
import {ActionGridHeader} from "./action-grid-header";

@Component({
    selector: 'jbr-action-header-date',
    templateUrl: './action-grid-header-date.html',
    styleUrls: ['./action-grid-header.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridHeaderDate extends ActionGridHeader {
    getText(): string {
        return "Date";
    }
}
