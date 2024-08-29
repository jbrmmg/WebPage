import {Component, Input} from "@angular/core";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'jbr-popup-header',
    templateUrl: './popup-header.component.html',
    styleUrls: ['./popup-header.component.css'],
    imports: [
        DatePipe
    ],
    standalone: true
})
export class PopupHeaderComponent {
    @Input() title: string;
    @Input() subTitle: string;
    @Input() imageUrl: string;
}
