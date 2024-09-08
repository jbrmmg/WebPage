import {Component, EventEmitter, HostListener, OnInit, TemplateRef, Type} from "@angular/core";
import {DatePipe, NgIf} from "@angular/common";
import {MoneyService} from "../../money.service";
import {TransactionEditType} from "../../transaction/transactionEditType";
import {GridDataInlineEdit} from "./grid-data-inline-edit";
import {GridDataEvent} from "./grid-data-event";
import {HeaderType} from "../header/grid-header-type";
import {TransactionReport} from "../../transaction/transactionReport";
import {PopupComponent} from "../../../standard/popup.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {GridEntryDate} from "../entry/date/grid-entry-date";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";

@Component({
    selector: 'jbr-grid-data-date',
    templateUrl: './grid-data-date.html',
    styleUrls: ['./grid-data-date.css'],
    imports: [
        DatePipe,
        NgIf,
        PopupComponent,
        BsDatepickerModule
    ],
    standalone: true
})
export class GridDataDate extends GridDataInlineEdit implements OnInit {
    modalRef: BsModalRef;

    content: Type<any>;
    inputs: Record<string,unknown>;

    dateValue: Date = new Date;

    constructor(private modalService: BsModalService,
                private datePipe: DatePipe) {
        super(TransactionEditType.Date);
    }

    ngOnInit(): void {
        let enterEvent: EventEmitter<Date> = new EventEmitter();

        enterEvent.subscribe(d => {
            this.onDateFromPopup(d);
        })

        this.content = GridEntryDate;
        this.inputs = {
            dateValue: this.dateValue,
            input: enterEvent };
    }

    @HostListener('document:click', ['$event'])
    clickOut(event) {
        if(this.inputElement != null) {
            if (!this.inputElement.nativeElement.contains(event.target)) {
                let value: string = this.inputElement.nativeElement.value;
                if(this.isEditing() && value.length > 0) {
                    this.completeEdit();
                }
            }
        }
    }

    onPopupDate(template: TemplateRef<any>) {
        // Date the date value for the popup.
        let date: Date = new Date(this.transaction.date + "T00:00:00");
        this.dateValue.setFullYear(date.getFullYear(),date.getMonth(),date.getDate());

        this.modalRef = this.modalService.show(template, {class: 'modal-md'});
    }

    interpretInput(text: string): void {
        this.transaction.date = MoneyService.getDate(text);

        let event: GridDataEvent = new GridDataEvent();
        event.transaction = this.transaction;
        event.source = HeaderType.Date;
        this.valueChanged.emit(event);
    }

    getValueForEdit(): string {
        return this.transaction.date;
    }

    canEdit(): boolean {
        if(this.transaction.type != TransactionReport.TRANSACTION) {
            return false;
        }

        // Date can only be edited if the transaction is new or not reconciled.
        return this.transaction.new || this.transaction.statement == null;
    }

    onExit() {
        this.modalRef.hide();
    }

    onOK() {
        this.modalRef.hide();
    }

    onDateFromPopup(newValue: Date) {
        // Set the date.
        this.modalRef.hide();

        // Set the transaction from the date.
        this.transaction.date = this.datePipe.transform(newValue,"yyyy-MM-dd");
        console.log(this.transaction.date);

        let event: GridDataEvent = new GridDataEvent();
        event.transaction = this.transaction;
        event.source = HeaderType.Date;
        this.valueChanged.emit(event);
    }
}
