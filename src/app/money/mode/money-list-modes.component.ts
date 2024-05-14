import {Component, EventEmitter, Input, Output} from "@angular/core";

export enum Mode {
    Normal,
    Add,
    Regular,
    Reconcile,
    Experimental
}

@Component({
    selector: 'jbr-money-list-modes',
    templateUrl: './money-list-modes.component.html',
    styleUrls: ['./money-list-modes.component.css']
})
export class MoneyListModesComponent {
    @Input() selectedMode: Mode;

    @Output() modeChange: EventEmitter<Mode> = new EventEmitter<Mode>();

    public getModeValue(value: number): Mode {
        return value;
    }

    public newModeSelected(mode: Mode) {
        this.selectedMode = mode;
        this.modeChange.emit(mode);
    }
}
