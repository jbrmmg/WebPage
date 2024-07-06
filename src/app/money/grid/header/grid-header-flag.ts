import {Component, Input} from "@angular/core";
import {FlagType} from "./grid-header-flag-type";
import {NgIf} from "@angular/common";
import {FilterEvent, GridHeader} from "./grid-header";

@Component({
    selector: 'jbr-grid-header-flag',
    templateUrl: './grid-header-flag.html',
    styleUrls: ['./grid-header-flag.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class GridHeaderFlag extends GridHeader {
    @Input() flagType: FlagType;

    unset() : boolean {
        let flag: boolean;

        switch(this.flagType) {
            case FlagType.Locked:
                flag = this.filter.locked;
                break;
            case FlagType.Reconciled:
                flag = this.filter.fromReconciled;
                break;
            case FlagType.Predicted:
                flag = this.filter.predicted;
        }

        return flag == null;
    }

    flagFilter() : boolean {
        let flag: boolean;

        switch(this.flagType) {
            case FlagType.Locked:
                flag = this.filter.locked;
                break;
            case FlagType.Reconciled:
                flag = this.filter.fromReconciled;
                break;
            case FlagType.Predicted:
                flag = this.filter.predicted;
        }

        if(flag == null) {
            return false;
        }

        return flag == true;
    }

    setFilter(value: boolean) {
        switch(this.flagType) {
            case FlagType.Locked:
                this.filter.locked = value;
                break;
            case FlagType.Reconciled:
                this.filter.fromReconciled = value;
                break;
            case FlagType.Predicted:
                this.filter.predicted = value;
        }
    }

    changeValue() {
        // Change the value.
        if(this.unset()) {
            this.setFilter(true);
        } else if(this.flagFilter() == true) {
            this.setFilter(false);
        } else {
            this.setFilter(null);
        }

        // Generate the event.
        let event: FilterEvent = new FilterEvent();
        event.filtered = !this.unset();
        this.filterChanged.emit(event);
    }
}
