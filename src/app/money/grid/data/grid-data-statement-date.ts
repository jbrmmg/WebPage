import {Component, EventEmitter, Output, TemplateRef} from "@angular/core";
import {DatePipe, NgIf} from "@angular/common";
import {GridData} from "./grid-data";
import {MoneyAccount} from "../../account/money-account.component";
import {MoneyStatement} from "../../statement/money-statement.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {MoneyService} from "../../money.service";
import {IStatement} from "../../statement/statement";

@Component({
    selector: 'jbr-grid-data-statement-date',
    templateUrl: './grid-data-statement-date.html',
    styleUrls: ['./grid-data-statement-date.css'],
    imports: [
        DatePipe,
        MoneyAccount,
        NgIf,
        MoneyStatement
    ],
    standalone: true
})
export class GridDataStatementDate extends GridData {
    modalRef: BsModalRef;
    @Output() statementLock: EventEmitter<IStatement> = new EventEmitter();

    constructor(protected _moneyService: MoneyService,
                private modalService: BsModalService) {
        super();
    }

    display() : string {
        if(this.transaction.statement) {
            return String(this.transaction.statement.year) + "-" + String(this.transaction.statement.month);
        }

        return "";
    }

    openModal(template: TemplateRef<any>) {
        if(this.transaction != null && this.transaction.statement != null) {
            this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
        }
    }

    getDate(): Date {
        return new Date(this.transaction.statement.year,this.transaction.statement.month - 1,1);
    }

    lock() {
        this.modalRef.hide();
        this.statementLock.emit(this.transaction.statement);
    }

    close() {
        this.modalRef.hide();
    }
}
