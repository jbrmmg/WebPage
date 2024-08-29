import {Component, EventEmitter, Input, Output} from "@angular/core";
import {NgIf} from "@angular/common";

@Component({
    selector: 'jbr-popup-body',
    templateUrl: './popup-button-bar.component.html',
    styleUrls: ['./popup-button-bar.component.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class PopupButtonBarComponent {
    @Output() exitEvent: EventEmitter<void> = new EventEmitter();
    @Output() clearEvent: EventEmitter<void> = new EventEmitter();
    @Output() okEvent: EventEmitter<void> = new EventEmitter();
    @Input() exit: boolean = false;
    @Input() ok: boolean = false;
    @Input() clear: boolean = false;

    onExit() {

    }

    onClear() {

    }

    onOK() {

    }
}
