import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GridData} from './grid-data';
import {GridDataActionType} from './grid-data-action-type';
import {NgClass, NgForOf} from '@angular/common';
import {GridDataEvent} from './grid-data-event';
import {HeaderType} from '../header/grid-header-type';
import {JbAccount} from '../../account/jbAccount';

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
    addOption: ActionOption = null;
    updateOption: ActionOption = null;
    @Input() gridDataChangeHandler: EventEmitter<GridDataEvent>;
    @Output() performAction: EventEmitter<GridDataEvent> = new EventEmitter();

    ngOnInit(): void {
        this.gridDataChangeHandler.asObservable().subscribe(next => {
            // Check if this is the same transaction for this action.
            if (this.transaction === next.transaction || (next.transaction.selected && this.transaction.selected)) {
                this.handleTransactionChange(next);
            }
        });

        // Check what actions are allowed.
        if (this.transaction.actionUpdate) {
            const update: ActionOption = new ActionOption();
            update.text = 'Update (pending)';
            update.code = 'UP';
            update.type = GridDataActionType.PendingUpdate;
            this.updateOption = update;
            this.actions.push(update);
        }
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
            const add: ActionOption = new ActionOption();
            add.text = 'Add (Pending)';
            add.code = 'P';
            add.type = GridDataActionType.PendingAdd;
            this.addOption = add;
            this.actions.push(add);

            const clear: ActionOption = new ActionOption();
            clear.text = 'Clear (Add)';
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

            case 'P':
            case 'UP':
                return 'btn-action btn btn-secondary';

            case 'R':
            case 'A':
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
            case 'U':
            case 'UP':
                return 'fa fa-pencil';
            case 'R':
            case 'P':
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

    handleNewTransactionChange() {
        // Is the transaction now able to be added?
        if (this.transaction != null) {
            if (this.transaction.date != null &&
                    this.transaction.account != null &&
                    this.transaction.account.id !== JbAccount.unknownAccountId &&
                    this.transaction.category != null &&
                    this.transaction.description != null &&
                    this.transaction.description.length > 0 &&
                    this.transaction.amount.value !== 0) {
                this.addOption.text = 'Add';
                this.addOption.code = 'A';
                this.addOption.type = GridDataActionType.Add;
            } else {
                this.addOption.text = 'Add (Pending)';
                this.addOption.code = 'P';
                this.addOption.type = GridDataActionType.PendingAdd;
            }
        }
    }

    handleStandardTransactionChange() {
        if (this.transaction != null) {
            if (this.transaction.modified) {
                this.updateOption.text = 'Update';
                this.updateOption.code = 'U';
                this.updateOption.type = GridDataActionType.Update;
            } else {
                this.updateOption.text = 'Update (pending)';
                this.updateOption.code = 'UP';
                this.updateOption.type = GridDataActionType.PendingUpdate;
            }
        }
    }

    handleTransactionChange(event: GridDataEvent) {
        console.log('Change: ' + event.transaction.description + ' ' + event.transaction.new + ' ' + event.source);

        // Is this a new transaction?
        if (this.transaction?.new) {
            this.handleNewTransactionChange();
        } else {
            this.handleStandardTransactionChange();
        }
    }
}
