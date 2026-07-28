import {Component, EventEmitter, OnInit, Output, TemplateRef, Type} from '@angular/core';
import {DatePipe, NgIf} from '@angular/common';
import {GridData} from './grid-data';
import {MoneyStatement} from '../../statement/money-statement.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {MoneyService} from '../../money.service';
import {IStatement} from '../../statement/statement';
import {PopupComponent} from '../../../standard/popup.component';
import {GridDataEvent} from './grid-data-event';
import {GridDataActionType} from './grid-data-action-type';
import {HeaderType} from '../header/grid-header-type';

@Component({
    selector: 'jbr-grid-data-statement-date',
    templateUrl: './grid-data-statement-date.html',
    styleUrls: ['./grid-data-statement-date.css'],
    imports: [
        DatePipe,
        NgIf,
        PopupComponent
    ],
    standalone: true
})
export class GridDataStatementDate extends GridData implements OnInit {
    modalRef: BsModalRef;
    @Output() statementLock: EventEmitter<IStatement> = new EventEmitter();
    @Output() performAction: EventEmitter<GridDataEvent> = new EventEmitter();

    content: Type<any>;
    inputs: Record<string, unknown>;
    lockEmitter: EventEmitter<void>;

    constructor(protected readonly _moneyService: MoneyService,
                private readonly modalService: BsModalService,
                private readonly datePipe: DatePipe) {
        super();
    }

    ngOnInit(): void {
        this.lockEmitter = new EventEmitter();
        this.lockEmitter.subscribe(() => {
           this.lock();
        });

        this.content = MoneyStatement;
        this.inputs = { account: this.transaction.account,
            statement: this.transaction.statement,
            lockEmitter: this.lockEmitter};
    }

    display(): string {
        if (this.transaction.statement) {
            return String(this.transaction.statement.year) + '-' + String(this.transaction.statement.month);
        }

        return '';
    }

    openModal(template: TemplateRef<any>) {
        if (this.transaction?.statement != null) {
            this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
        }
    }

    getDateDisplay(): string {
        return this.datePipe.transform(new Date(this.transaction.statement.year, this.transaction.statement.month - 1, 1), 'MMMM yyyy');
    }

    doReconcile() {
        const event = new GridDataEvent();
        event.transaction = this.transaction;
        event.source = HeaderType.StatementDate;
        event.action = GridDataActionType.Reconcile;
        this.performAction.emit(event);
    }

    doUnreconcile() {
        const event = new GridDataEvent();
        event.transaction = this.transaction;
        event.source = HeaderType.StatementDate;
        event.action = GridDataActionType.Unreconcile;
        this.performAction.emit(event);
    }

    lock() {
        this.modalRef.hide();
        this.statementLock.emit(this.transaction.statement);
    }

    close() {
        this.modalRef.hide();
    }
}
