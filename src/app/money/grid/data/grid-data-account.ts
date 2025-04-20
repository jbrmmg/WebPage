import {Component, EventEmitter, OnInit, TemplateRef, Type} from "@angular/core";
import {MoneyService} from "../../money.service";
import {NgIf} from "@angular/common";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {MoneyAccount} from "../../account/money-account.component";
import {JbAccount} from "../../account/jbAccount";
import {GridData} from "./grid-data";
import {TransactionEditType} from "../../transaction/transactionEditType";
import {GridDataEvent} from "./grid-data-event";
import {HeaderType} from "../header/grid-header-type";
import {PopupComponent} from "../../../standard/popup.component";

@Component({
    selector: 'jbr-grid-data-account',
    templateUrl: './grid-data-account.html',
    styleUrls: ['./grid-data-account.css'],
    imports: [
        NgIf,
        PopupComponent
    ],
    standalone: true
})
export class GridDataAccount extends GridData implements OnInit {
    modalRef: BsModalRef;

    content: Type<any>;
    inputs: Record<string,unknown>;

    selectEvent: EventEmitter<JbAccount>;

    constructor(private modalService: BsModalService) {
        super();
    }

    ngOnInit(): void {
        this.selectEvent = new EventEmitter();
        this.selectEvent.subscribe(account => {
            this.onSelect(account);
        });

        this.content = MoneyAccount;
        this.inputs = { filterMode: false,
            allowClosed: false,
            selectEvent: this.selectEvent };
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
