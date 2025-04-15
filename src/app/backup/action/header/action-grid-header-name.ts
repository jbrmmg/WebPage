import {Component} from "@angular/core";
import {ActionGridHeader} from "./action-grid-header";

@Component({
    selector: 'jbr-action-header-name',
    templateUrl: './action-grid-header-name.html',
    styleUrls: ['./action-grid-header.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridHeaderName extends ActionGridHeader {
    getText(): string {
        return "name";
    }
}
