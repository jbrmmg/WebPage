import {Component, EventEmitter, Input, OnInit} from "@angular/core";
import {GridData} from "./grid-data";
import {GridDataActionType} from "./grid-data-action-type";
import {NgClass, NgForOf} from "@angular/common";
import {GridDataChangeEvent} from "./grid-data-change-event";

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
    @Input() gridDataChangeHandler: EventEmitter<GridDataChangeEvent>;

    ngOnInit():void {
        this.gridDataChangeHandler.asObservable().subscribe(next => {
            // Check if this is the same transaction for this action.
            if(this.transaction == next.transaction) {
                this.handleTransactionChange(next);
            }
        });

        // Check what actions are allowed.
        if(this.transaction.actionUpdateCategory) {
            let updateCategory: ActionOption = new ActionOption();
            updateCategory.text = "Update Category";
            updateCategory.code = "UC";
            updateCategory.type = GridDataActionType.UpdateCategory;
            this.actions.push(updateCategory)
        }
        if(this.transaction.actionUpdate) {
            let update: ActionOption = new ActionOption();
            update.text = "Update";
            update.code = "U";
            update.type = GridDataActionType.Update;
            this.actions.push(update);
        }
        if(this.transaction.actionReconcile) {
            let reconcile: ActionOption = new ActionOption();
            reconcile.text = "Reconcile";
            reconcile.code = "R";
            reconcile.type = GridDataActionType.Reconcile;
            this.actions.push(reconcile);
        }
        if(this.transaction.actionUnreconcile){
            let unreconcile: ActionOption = new ActionOption();
            unreconcile.text = "Unreconcile";
            unreconcile.code = "UN";
            unreconcile.type = GridDataActionType.Unreconcile;
            this.actions.push(unreconcile);
        }
        if(this.transaction.actionDelete){
            let deleteOpt: ActionOption = new ActionOption();
            deleteOpt.text = "Delete";
            deleteOpt.code = "D";
            deleteOpt.type = GridDataActionType.Delete;
            this.actions.push(deleteOpt);
        }
        if(this.transaction.new) {
            let add: ActionOption = new ActionOption();
            add.text = "Add (Pending)"
            add.code = "P";
            add.type = GridDataActionType.PendingAdd;
            this.addOption = add;
            this.actions.push(add);

            let clear: ActionOption = new ActionOption();
            clear.text = "Clear (Add)"
            clear.code = "C";
            clear.type = GridDataActionType.ClearAdd;
            this.actions.push(clear);
        }
    }

    getClass(action: ActionOption){
        switch(action.code) {
            case "C":
            case "D":
                return "btn-action btn btn-danger";

            case "P":
                return "btn-action btn btn-secondary";

            case "R":
            case "A":
                return "btn-action btn btn-success";

            case "UN":
                return "btn-action btn btn-warning";
        }

        return "btn-action btn btn-primary";
    }

    getIconClass(action: ActionOption): string {
        switch(action.code) {
            case "C":
            case "UN":
                return "fa fa-times";
            case "UC":
                return "fa fa-list";
            case "U":
                return "fa fa-pencil";
            case "R":
            case "P":
                return "fa fa-check";
            case "D":
                return "fa fa-trash";
        }

        return "fa fa-save";
    }

    getTitle(action: ActionOption): string {
        return action.text;
    }

    doAction(action: ActionOption) {
        console.log("Do Action: " + action.text);
    }

    handleNewTransactionChange() {
        // Is the transaction now able to be added?
        if(this.transaction != null) {
            if ( this.transaction.date != null &&
                    this.transaction.account != null &&
                    this.transaction.category != null &&
                    this.transaction.description != null &&
                    this.transaction.description.length > 0 &&
                    this.transaction.amount.value != 0) {
                this.addOption.text = "Add";
                this.addOption.code = "A";
                this.addOption.type = GridDataActionType.Add;
            } else {
                this.addOption.text = "Add (Pending)"
                this.addOption.code = "P";
                this.addOption.type = GridDataActionType.PendingAdd;
            }
        }
    }

    handleStandardTransactionChange(event: GridDataChangeEvent) {

    }

    handleTransactionChange(event: GridDataChangeEvent) {
        console.log("Change: " + event.transaction.description + " " + event.transaction.new + " " + event.source);

        // Is this a new transaction?
        if(this.transaction != null && this.transaction.new) {
            this.handleNewTransactionChange();
        } else {
            this.handleStandardTransactionChange(event);
        }
    }
}
