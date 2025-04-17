import {Component} from "@angular/core";
import {ActionGridHeader} from "./action-grid-header";

@Component({
    selector: 'jbr-action-header-size',
    templateUrl: './action-grid-header-size.html',
    styleUrls: ['./action-grid-header.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridHeaderSize extends ActionGridHeader {
    getText(): string {
        return "Size";
    }
}
