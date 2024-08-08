import {Component, Input, TemplateRef} from "@angular/core";
import {ITransactionReport} from "../../transaction/TransactionReport";
import {MoneyService} from "../../money.service";
import {NgIf} from "@angular/common";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {MoneyCategory} from "../../category/money-cat.component";
import {MoneyAccount} from "../../account/money-account.component";
import {JbAccount} from "../../account/jbaccount";

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
export class GridDataAccount {
    @Input() transaction: ITransactionReport;
    modalRef: BsModalRef;

    constructor(private modalService: BsModalService) {
    }

    hasAccount() : boolean {
        return this.transaction != null && this.transaction.account != null;
    }

    getAccountImage() : string {
        return MoneyService.getAccountImage(this.transaction.account.id);
    }

    openModal(template: TemplateRef<any>) {
        if(this.transaction != null && this.transaction.new) {
            this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
        }
    }

    onSelect(account: JbAccount) {
        if(this.transaction !=null) {
            this.transaction.account = account;
        }

        this.modalRef.hide();
    }

    onExit() {
        this.modalRef.hide();
    }
}
