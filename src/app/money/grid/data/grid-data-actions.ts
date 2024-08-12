import {Component, OnInit} from "@angular/core";
import {GridData} from "./grid-data";
import {GridDataActionType} from "./grid-data-action-type";
import {NgForOf} from "@angular/common";

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
        NgForOf
    ],
    standalone: true
})
export class GridDataActions extends GridData implements OnInit {
    actions: ActionOption[] = [];

    ngOnInit():void {
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
            this.actions.push(add);

            let clear: ActionOption = new ActionOption();
            clear.text = "Clear (Add)"
            clear.code = "C";
            clear.type = GridDataActionType.ClearAdd;
            this.actions.push(clear);
        }
    }

    doAction(action: ActionOption) {
        console.log("Do Action: " + action.text);
    }
}
