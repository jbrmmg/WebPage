import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {GridData} from './grid-data';
import {GridDataActionType} from './grid-data-action-type';
import {NgClass, NgForOf} from '@angular/common';
import {GridDataEvent} from './grid-data-event';
import {HeaderType} from '../header/grid-header-type';

class ActionOption {
    text: string;
    code: string;
    type: GridDataActionType;
}

@Component({
    selector: 'jbr-grid-data-actions',
    templateUrl: './grid-data-actions.html',
    styleUrls: ['./grid-data-actions.css'],
    imports: [
        NgForOf,
        NgClass
    ],
    standalone: true
})
export class GridDataActions extends GridData implements OnInit {
    actions: ActionOption[] = [];
    @Output() performAction: EventEmitter<GridDataEvent> = new EventEmitter();

    ngOnInit(): void {
        if (this.transaction.actionReconcile) {
            const reconcile: ActionOption = new ActionOption();
            reconcile.text = 'Reconcile';
            reconcile.code = 'R';
            reconcile.type = GridDataActionType.Reconcile;
            this.actions.push(reconcile);
        }
        if (this.transaction.actionUnreconcile) {
            const unreconcile: ActionOption = new ActionOption();
            unreconcile.text = 'Unreconcile';
            unreconcile.code = 'UN';
            unreconcile.type = GridDataActionType.Unreconcile;
            this.actions.push(unreconcile);
        }
        if (this.transaction.actionDelete) {
            const deleteOpt: ActionOption = new ActionOption();
            deleteOpt.text = 'Delete';
            deleteOpt.code = 'D';
            deleteOpt.type = GridDataActionType.Delete;
            this.actions.push(deleteOpt);
        }
        if (this.transaction.new) {
            const clear: ActionOption = new ActionOption();
            clear.text = 'Clear';
            clear.code = 'C';
            clear.type = GridDataActionType.ClearAdd;
            this.actions.push(clear);
        }
    }

    getClass(action: ActionOption) {
        switch (action.code) {
            case 'C':
            case 'D':
                return 'btn-action btn btn-danger';

            case 'R':
                return 'btn-action btn btn-success';

            case 'UN':
                return 'btn-action btn btn-warning';
        }

        return 'btn-action btn btn-primary';
    }

    getIconClass(action: ActionOption): string {
        switch (action.code) {
            case 'C':
            case 'UN':
                return 'fa fa-times';
            case 'R':
                return 'fa fa-check';
            case 'D':
                return 'fa fa-trash';
        }

        return 'fa fa-save';
    }

    getTitle(action: ActionOption): string {
        return action.text;
    }

    doAction(action: ActionOption) {
        const event: GridDataEvent = new GridDataEvent();
        event.action = action.type;
        event.transaction = this.transaction;
        event.source = HeaderType.Action;

        this.performAction.emit(event);
    }

}
