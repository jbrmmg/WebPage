import {Component, OnInit, TemplateRef, Type} from "@angular/core";
import {ButtonsModule} from "ngx-bootstrap/buttons";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {FormsModule} from "@angular/forms";
import {FilterEvent, GridHeader} from "./grid-header";
import {HeaderType} from "./grid-header-type";
import {MoneyAccount} from "../../account/money-account.component";
import {PopupComponent} from "../../../standard/popup.component";

@Component({
    selector: 'jbr-grid-header-account',
    templateUrl: './grid-header-account.html',
    styleUrls: ['./grid-header-account.css'],
    imports: [
        ButtonsModule,
        FormsModule,
        PopupComponent
    ],
    standalone: true
})
export class GridHeaderAccount extends GridHeader implements OnInit {
    modalRef: BsModalRef;
    columns: number = 4;
    allSelected: boolean;
    content: Type<any>;
    inputs: Record<string,unknown>;

    constructor(private modalService: BsModalService) {
        super();
    }

    ngOnInit(): void {
        if(this.filter.accounts == null) {
            this.filter.accounts = [];
        }

        // Set up the content
        this.content = MoneyAccount;
        this.inputs = { filterMode: true,
            allowClosed: true,
            filter: this.filter,
            allSelected: this.allSelected };
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }

    onExit() {
        this.modalRef.hide();
    }

    onClear() {
        this.modalRef.hide();

        this.filter.accounts = [];

        // Update filter event.
        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.Account;
        this.filterChanged.emit(event);
    }

    onOK() {
        this.modalRef.hide();

        // If all are selected then clear the filter as it's the same as no filter.
        if(this.allSelected) {
            this.filter.accounts = [];
        }

        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.Account;
        this.filterChanged.emit(event);
    }
}
