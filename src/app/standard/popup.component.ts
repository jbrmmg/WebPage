import {Component, EventEmitter, Input, Output, Type} from "@angular/core";
import {NgComponentOutlet, NgIf} from "@angular/common";

@Component({
    selector: 'jbr-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.css'],
    imports: [
        NgIf,
        NgComponentOutlet
    ],
    standalone: true
})
export class PopupComponent {
    @Output() exitEvent: EventEmitter<void> = new EventEmitter();
    @Output() clearEvent: EventEmitter<void> = new EventEmitter();
    @Output() okEvent: EventEmitter<void> = new EventEmitter();
    @Input() imageUrl: string;
    @Input() title: string;
    @Input() subTitle: string;
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
