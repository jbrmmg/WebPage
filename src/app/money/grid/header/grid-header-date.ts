import {Component, EventEmitter, OnInit, TemplateRef, Type} from '@angular/core';
import {FilterEvent, GridHeader} from './grid-header';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {HeaderType} from './grid-header-type';
import {PopupComponent} from '../../../standard/popup.component';
import {GridFilterDate} from '../filters/grid-filter-date';

@Component({
    selector: 'jbr-grid-header-date',
    templateUrl: './grid-header-date.html',
    styleUrls: ['./grid-header-date.css'],
    imports: [
        BsDatepickerModule,
        PopupComponent
    ],
    standalone: true
})
export class GridHeaderDate extends GridHeader implements OnInit {
    modalRef: BsModalRef;
    content: Type<any>;
    inputs: Record<string, unknown>;
    clearEvent: EventEmitter<void> = new EventEmitter();
    okEvent: EventEmitter<void> = new EventEmitter();

    constructor(private readonly modalService: BsModalService ) {
        super();
    }

    ngOnInit(): void {
        this.content = GridFilterDate;
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

        if (this.filter != null) {
            this.filter.dateRange = null;
        }

        const event: FilterEvent = new FilterEvent();
        event.source = HeaderType.Date;
        this.filterChanged.emit(event);
    }

    onOK() {
        this.modalRef.hide();

        this.okEvent.emit();

        const event: FilterEvent = new FilterEvent();
        event.source = HeaderType.Date;
        this.filterChanged.emit(event);
    }
}
