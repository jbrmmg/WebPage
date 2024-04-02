import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Mode} from "./money-list-modes.component"

@Component({
    selector: 'jbr-money-list-mode',
    templateUrl: './money-list-mode.component.html',
    styleUrls: ['./money-list-mode.component.css']
})
export class MoneyListModeComponent implements OnInit {
    @Input() mode: Mode;

    @Output() select: EventEmitter<Mode> = new EventEmitter<Mode>();

    ngOnInit(): void {
    }

    modeSelected(): void {
        this.select.emit(this.mode);
    }

    getMode(mode: Mode): boolean {
        return mode === this.mode;
    }

    get getClass() {
        switch (this.mode) {
            case Mode.Normal:
                return "fa fa-align-justify";
            case Mode.Add:
                return "fa fa-plus-circle";
            case Mode.Regular:
                return "fa fa-recycle";
            case Mode.Reconcile:
                return "fa fa-balance-scale";
            case Mode.Experimental:
                return "fa fa-question";
        }
    }

    get getModeName() {
        switch (this.mode) {
            case Mode.Normal:
                return "normal";
            case Mode.Add:
                return "addTransaction";
            case Mode.Regular:
                return "regular";
            case Mode.Reconcile:
                return "reconcile";
            case Mode.Experimental:
                return "experiment";
        }
    }

    get getIndex() {
        switch (this.mode) {
            case Mode.Normal:
                return 0;
            case Mode.Add:
                return 1;
            case Mode.Regular:
                return 2;
            case Mode.Reconcile:
                return 3;
            case Mode.Experimental:
                return 4;
        }
    }
}
