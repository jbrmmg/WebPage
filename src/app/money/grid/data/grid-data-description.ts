import {Component, ElementRef, EventEmitter, Output, ViewChild} from "@angular/core";
import {TransactionReport} from "../../transaction/TransactionReport";
import {MoneyService} from "../../money.service";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {GridData} from "./grid-data";

@Component({
    selector: 'jbr-grid-data-description',
    templateUrl: './grid-data-description.html',
    styleUrls: ['./grid-data-description.css'],
    imports: [
        NgIf,
        FormsModule
    ],
    standalone: true
})
export class GridDataDescription extends GridData {
    @Output() edit: EventEmitter<void> = new EventEmitter();

    @ViewChild('input') input: ElementRef;

    protected readonly MoneyService = MoneyService;

    constructor() {
        super();
    }

    getDescription(): string {
        if(this.transaction.type == TransactionReport.TRANSACTION) {
            if(this.transaction.description == null || this.transaction.description.length == 0) {
                return "&nbsp;";
            } else {
                return this.transaction.description;
            }
        }

        if(this.transaction.type == TransactionReport.OPEN_BALANCE) {
            return "Opening Balance"
        }

        if(this.transaction.type == TransactionReport.TODAY_BALANCE) {
            return "Balance Today"
        }

        if(this.transaction.type == TransactionReport.FUTURE_BALANCE) {
            return "Future Balance"
        }

        return "&nbsp;";
    }

    blank(): boolean {
        if(this.transaction.type == TransactionReport.TRANSACTION) {
            return this.transaction.description == null || this.transaction.description.length == 0;
        }

        return !((this.transaction.type == TransactionReport.OPEN_BALANCE) ||
            (this.transaction.type == TransactionReport.TODAY_BALANCE) ||
            (this.transaction.type == TransactionReport.FUTURE_BALANCE));
    }

    getCategoryColour(): string {
        if(this.transaction == null || this.transaction.category == null || this.transaction.category.colour == null) {
            return "FFFFFF";
        }

        return this.transaction.category.colour;
    }

    getTextColour() {
        return MoneyService.getTextColor(this.getCategoryColour());
    }

    onClick() {
        // Is this field editable?
        if(this.transaction.type == TransactionReport.TRANSACTION) {
            if(!this.transaction.editing) {
                this.edit.emit();
                this.transaction.editing = true;
                setTimeout(()=> {
                    this.input.nativeElement.focus();
                },0);
            }
            return;
        }

        this.transaction.editing = false;
    }

    onKeydown(event: any) {
        if(event.key === "Escape") {
            this.transaction.editing = false;
            return;
        }

        if(event.key === "Enter") {
            this.transaction.description = this.input.nativeElement.value;
            this.transaction.editing = false;
            return;
        }
    }
}
