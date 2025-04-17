import {Component} from "@angular/core";
import {ActionGridHeader} from "./action-grid-header";

@Component({
    selector: 'jbr-action-header-confirmed',
    templateUrl: './action-grid-header-confirmed.html',
    styleUrls: ['./action-grid-header.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridHeaderConfirmed extends ActionGridHeader {
    getText(): string {
        return "Confirmed";
    }
}
