import {Component} from "@angular/core";
import {ActionGridHeader} from "./action-grid-header";

@Component({
    selector: 'jbr-action-header-image',
    templateUrl: './action-grid-header-image.html',
    styleUrls: ['./action-grid-header.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridHeaderImage extends ActionGridHeader {
    getText(): string {
        return "Image";
    }
}
