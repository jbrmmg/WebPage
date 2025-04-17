import {Component} from "@angular/core";
import {ActionGridHeader} from "./action-grid-header";

@Component({
    selector: 'jbr-action-header-action',
    templateUrl: './action-grid-header-action.html',
    styleUrls: ['./action-grid-header.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridHeaderAction extends ActionGridHeader {
    getText(): string {
        return "Action";
    }
}
