import {Component, ElementRef, Input, ViewChild} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";
import {DatePipe, NgIf} from "@angular/common";
import {MoneyService} from "../../money.service";

@Component({
    selector: 'jbr-grid-data-date',
    templateUrl: './grid-data-date.html',
    styleUrls: ['./grid-data-date.css'],
    imports: [
        DatePipe,
        NgIf
    ],
    standalone: true
})
export class GridDataDate {
    @Input() transaction: ITransactionReport;

    @ViewChild('input') input: ElementRef;

    isEditing() {
        return this.transaction != null && this.transaction.editing;
    }

    onClick() {
        if(this.transaction != null && this.transaction.new) {
            if(!this.transaction.editing) {
                this.transaction.editing = true;
                setTimeout(()=> {
                    this.input.nativeElement.focus();
                },0);
            }
            return;
        }

        if(this.transaction != null) {
            this.transaction.editing = false;
        }
    }

    onKeydown(event: any) {
        if(event.key === "Escape") {
            this.transaction.editing = false;
            return;
        }

        if(event.key === "Enter") {
            // Convert the text entered into a date.
            this.transaction.date = MoneyService.getDate("");
            this.transaction.editing = false;
            return;
        }
    }
}
