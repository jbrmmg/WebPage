import {Component, TemplateRef} from "@angular/core";
import {MoneyService} from "../../money.service";
import {NgIf} from "@angular/common";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {MoneyCategory} from "../../category/money-cat.component";
import {MoneyAccount} from "../../account/money-account.component";
import {JbAccount} from "../../account/jbaccount";
import {GridData} from "./grid-data";
import {TransactionEditType} from "../../transaction/transactionEditType";
import {GridDataEvent} from "./grid-data-event";
import {HeaderType} from "../header/grid-header-type";

@Component({
    selector: 'jbr-grid-data-account',
    templateUrl: './grid-data-account.html',
    styleUrls: ['./grid-data-account.css'],
    imports: [
        NgIf,
        MoneyCategory,
        MoneyAccount
    ],
    standalone: true
})
export class GridDataAccount extends GridData {
    modalRef: BsModalRef;

    constructor(private modalService: BsModalService) {
        super();
    }

    hasAccount() : boolean {
        return this.transaction != null && this.transaction.account != null;
    }

    getAccountImage() : string {
        return MoneyService.getAccountImage(this.transaction.account.id);
    }

    openModal(template: TemplateRef<any>) {
        if(this.transaction != null && this.transaction.new) {
            this.transaction.editing = TransactionEditType.None;
            this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
        }
    }

    onSelect(account: JbAccount) {
        if(this.transaction !=null) {
            this.transaction.account = account;

            let event: GridDataEvent = new GridDataEvent();
            event.transaction = this.transaction;
            event.source = HeaderType.Account;
            this.valueChanged.emit(event);
        }

        this.modalRef.hide();
    }

    onExit() {
        this.modalRef.hide();
    }
}
