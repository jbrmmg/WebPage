import {Component} from "@angular/core";
import {ActionGridHeader} from "./action-grid-header";

@Component({
    selector: 'jbr-action-header-confirm',
    templateUrl: './action-grid-header-confirm.html',
    styleUrls: ['./action-grid-header.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridHeaderConfirm extends ActionGridHeader {
    getText(): string {
        return "Confirm";
    }
}
