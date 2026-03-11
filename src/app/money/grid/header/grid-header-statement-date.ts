import {Component, EventEmitter, OnInit, TemplateRef, Type} from '@angular/core';
import {FilterEvent, GridHeader} from './grid-header';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {StatementDate} from '../../statement/statementDate';
import {HeaderType} from './grid-header-type';
import {PopupComponent} from '../../../standard/popup.component';
import {GridFilterStatementDate} from '../filters/grid-filter-statement-date';

@Component({
    selector: 'jbr-grid-header-statement-date',
    templateUrl: './grid-header-statement-date.html',
    styleUrls: ['./grid-header-statement-date.css'],
    imports: [
        BsDatepickerModule,
        PopupComponent
    ],
    standalone: true
})
export class GridHeaderStatementDate extends GridHeader implements OnInit {
    modalRef: BsModalRef;
    content: Type<any>;
    inputs: Record<string, unknown>;
    okEvent: EventEmitter<StatementDate> = new EventEmitter();

    constructor(private modalService: BsModalService) {
        super();
    }

    ngOnInit(): void {
        this.okEvent.subscribe((statementDate) => {
            this.onOK(statementDate);
        });

        this.content = GridFilterStatementDate;
        this.inputs = { okEvent: this.okEvent };
    }

    onClear() {
        this.modalRef.hide();

        if (this.filter != null) {
            this.filter.statementDate = null;
        }

        const event: FilterEvent = new FilterEvent();
        event.source = HeaderType.StatementDate;
        this.filterChanged.emit(event);
    }

    onExit() {
        this.modalRef.hide();
    }

    onOK(statementDate: StatementDate) {
        this.modalRef.hide();

        // Set the filter and then exit.
        if (this.filter != null) {
            this.filter.statementDate = statementDate;
        }

        const event: FilterEvent = new FilterEvent();
        event.source = HeaderType.StatementDate;
        this.filterChanged.emit(event);
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }
}
