import {Component, TemplateRef} from "@angular/core";
import {ButtonsModule} from "ngx-bootstrap/buttons";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {FormsModule} from "@angular/forms";
import {FilterEvent, GridHeader} from "./grid-header";
import {HeaderType} from "./grid-header-type";
import {MoneyAccount} from "../../account/money-account.component";
import {MoneyCategory} from "../../category/money-cat.component";
import {JbAccount} from "../../account/jbAccount";

@Component({
    selector: 'jbr-grid-header-account',
    templateUrl: './grid-header-account.html',
    styleUrls: ['./grid-header-account.css'],
    imports: [
        ButtonsModule,
        NgForOf,
        NgIf,
        FormsModule,
        NgClass,
        MoneyAccount,
        MoneyCategory
    ],
    standalone: true
})
export class GridHeaderAccount extends GridHeader {
    modalRef: BsModalRef;
    columns: number = 4;
    accountIds: string[] = [];

    constructor(private modalService: BsModalService) {
        super();
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }

    onExit() {
        this.modalRef.hide();
    }

    onClear() {
        this.modalRef.hide();

        this.accountIds = [];
        this.filter.accounts = [];

        // Update filter event.
        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.Account;
        this.filterChanged.emit(event);
    }

    onSelect(selected: JbAccount[]) {
        this.modalRef.hide();

        this.filter.accounts = [];
        selected.forEach(next => {
            this.filter.accounts.push(next);
        })

        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.Account;
        this.filterChanged.emit(event);
    }
}
