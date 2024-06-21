import {Component, Input} from "@angular/core";
import {TransactionFilter} from "../../transaction/transactionFilter";
import {FlagType} from "./grid-header-flag-type";
import {NgIf} from "@angular/common";

@Component({
    selector: 'jbr-grid-header-flag',
    templateUrl: './grid-header-flag.html',
    styleUrls: ['./grid-header-flag.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class GridHeaderFlag {
    @Input() filter : TransactionFilter;
    @Input() header: string;
    @Input() flagType: FlagType;

    flagSpecified() : boolean {
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

        return flag != null;
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
}
