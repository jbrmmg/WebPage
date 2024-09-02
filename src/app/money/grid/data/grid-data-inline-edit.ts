import {Component, ElementRef, ViewChild} from "@angular/core";
import {GridData} from "./grid-data";
import {TransactionEditType} from "../../transaction/transactionEditType";

@Component({
    selector: '',
    template: '',
    standalone: true,
    styles: []
})
export abstract class GridDataInlineEdit extends GridData {
    editType: TransactionEditType;

    @ViewChild('input') inputElement: ElementRef;

    protected constructor(editType: TransactionEditType) {
        super();
        this.editType = editType;
    }

    abstract interpretInput(text: string): void;

    abstract getValueForEdit(): string;

    abstract canEdit(): boolean;

    isEditing(): boolean {
        return this.transaction != null && this.transaction.editing == this.editType;
    }

    onClick() {
        if(this.transaction != null && this.canEdit()) {
            if(this.transaction.editing != this.editType) {
                this.transaction.editing = this.editType;
                setTimeout(()=> {
                    this.inputElement.nativeElement.value = this.getValueForEdit();
                    this.inputElement.nativeElement.focus();
                },0);
            }
            return;
        }

        if(this.transaction != null) {
            this.transaction.editing = TransactionEditType.None;
        }
    }

    completeEdit() {
        this.interpretInput(this.inputElement.nativeElement.value);
        this.transaction.editing = TransactionEditType.None;
    }

    onKeydown(event: any) {
        if(event.key === "Escape") {
            this.transaction.editing = TransactionEditType.None;
            return;
        }

        if(event.key === "Enter") {
            // Convert the text entered into a date.
            this.completeEdit();
            return;
        }
    }
}
