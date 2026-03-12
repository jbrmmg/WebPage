import {Component, EventEmitter, OnInit, Output, TemplateRef, Type} from '@angular/core';
import {DatePipe} from '@angular/common';
import {GridData} from './grid-data';
import {MoneyStatement} from '../../statement/money-statement.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {MoneyService} from '../../money.service';
import {IStatement} from '../../statement/statement';
import {PopupComponent} from '../../../standard/popup.component';

@Component({
    selector: 'jbr-grid-data-statement-date',
    templateUrl: './grid-data-statement-date.html',
    styleUrls: ['./grid-data-statement-date.css'],
    imports: [
        DatePipe,
        PopupComponent
    ],
    standalone: true
})
export class GridDataStatementDate extends GridData implements OnInit {
    modalRef: BsModalRef;
    @Output() statementLock: EventEmitter<IStatement> = new EventEmitter();

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

    lock() {
        this.modalRef.hide();
        this.statementLock.emit(this.transaction.statement);
    }

    close() {
        this.modalRef.hide();
    }
}
