import {Component, EventEmitter, OnInit, TemplateRef, Type} from "@angular/core";
import {FilterEvent, GridHeader} from "./grid-header";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {DatePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HeaderType} from "./grid-header-type";
import {PopupComponent} from "../../../standard/popup.component";
import {GridFilterAmount} from "../filters/grid-filter-amount";

@Component({
    selector: 'jbr-grid-header-amount',
    templateUrl: './grid-header-amount.html',
    styleUrls: ['./grid-header-amount.css'],
    imports: [
        BsDatepickerModule,
        DatePipe,
        FormsModule,
        PopupComponent
    ],
    standalone: true
})
export class GridHeaderAmount extends GridHeader implements OnInit {
    modalRef: BsModalRef;
    content: Type<any>;
    inputs: Record<string,unknown>;
    clearEvent: EventEmitter<void> = new EventEmitter();
    okEvent: EventEmitter<void> = new EventEmitter();

    constructor(private modalService: BsModalService ) {
        super();
    }

    ngOnInit(): void {
        this.content = GridFilterAmount;
        this.inputs = { filter: this.filter,
            clearEvent: this.clearEvent,
            okEvent: this.okEvent };
    }

    onExit() {
        this.modalRef.hide();
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }

    onClear() {
        this.modalRef.hide();

        if(this.filter != null) {
            this.filter.valueRange = null;
        }

        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.Credit;
        this.filterChanged.emit(event);
    }

    onOK() {
        this.modalRef.hide();

        this.okEvent.emit();

        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.Credit;
        this.filterChanged.emit(event);
    }
}
