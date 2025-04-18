import {Component, EventEmitter, Output} from "@angular/core";
import {ActionGridData} from "./action-grid-data";
import {Action} from "../backup-action";

@Component({
    selector: 'jbr-action-data-confirm',
    templateUrl: './action-grid-data-confirm.html',
    styleUrls: ['./action-grid-data.css'],
    imports: [
    ],
    standalone: true
})
export class ActionGridDataConfirm extends ActionGridData {
    @Output() confirm: EventEmitter<Action> = new EventEmitter<Action>();

    getText(): string {
        if(this.action && this.action.confirmed) {
            return "" + this.action.confirmed;
        }

        return "";
    }

    confirmAction() {
        this.confirm.emit(this.action);
    }
}
