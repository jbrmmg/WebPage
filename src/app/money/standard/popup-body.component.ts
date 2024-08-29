import {Component, EventEmitter, Input, Output, Type} from "@angular/core";
import {NgComponentOutlet, NgIf} from "@angular/common";
import {MoneyComponent} from "../money.component";

@Component({
    selector: 'jbr-popup-body',
    templateUrl: './popup-body.component.html',
    styleUrls: ['./popup-body.component.css'],
    imports: [
        NgIf,
        NgComponentOutlet
    ],
    standalone: true
})
export class PopupBodyComponent {
    @Output() exitEvent: EventEmitter<void> = new EventEmitter();
    @Output() clearEvent: EventEmitter<void> = new EventEmitter();
    @Output() okEvent: EventEmitter<void> = new EventEmitter();
    @Input() exit: boolean = false;
    @Input() ok: boolean = false;
    @Input() clear: boolean = false;
    @Input() content: Type<any>;
    @Input() inputs: Record<string,unknown>;

    onExit() {
        this.exitEvent.emit();
    }

    onClear() {
        this.clearEvent.emit();
    }

    onOK() {
        this.okEvent.emit();
    }
}
