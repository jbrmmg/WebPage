import {Component, OnInit, TemplateRef} from "@angular/core";
import {ButtonsModule} from "ngx-bootstrap/buttons";
import {NgForOf, NgIf} from "@angular/common";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {MoneyService} from "../../money.service";
import {FormsModule} from "@angular/forms";
import {FilterEvent, GridHeader} from "./grid-header";
import {JbAccount} from "../../account/jbaccount";
import {HeaderType} from "./grid-header-type";

class AccountFilterOption {
    id: string;
    display: string;
    selected: boolean;
}

@Component({
    selector: 'jbr-grid-header-account',
    templateUrl: './grid-header-account.html',
    styleUrls: ['./grid-header-account.css'],
    imports: [
        ButtonsModule,
        NgForOf,
        NgIf,
        FormsModule
    ],
    standalone: true
})
export class GridHeaderAccount extends GridHeader implements OnInit {
    modalRef: BsModalRef;
    accounts: AccountFilterOption[] = [];
    errorMessage: string;

    constructor(private modalService: BsModalService,
                private _moneyService: MoneyService ) {
        super();
    }

    ngOnInit(): void {
        this._moneyService.getAccounts().subscribe({
            next: (accounts) => {
                accounts.forEach(value => {
                    let next: AccountFilterOption = new AccountFilterOption();
                    next.selected = this.isAccountSelected(value.id);
                    next.display = value.name;
                    if(value.closed) {
                        next.display += " (closed)";
                    }
                    next.id = value.id;

                    this.accounts.push(next);
                })
            },
            error: (response) => this.errorMessage = <any> response,
            complete: () => {
                console.log("Account Options Loaded")
            }
        });
    }

    isAccountSelected(id: string) : boolean {
        if(this.filter == null || this.filter.accounts == null || this.filter.accounts.length < 1) {
            return false;
        }

        let result: boolean = false;
        this.filter.accounts.forEach(value => {
            if(value.id == id) {
                result = true;
                return;
            }
        });

        return result;
    }

    getAccountImage(id: string) : string {
        return MoneyService.getAccountImage(id);
    }

    openModal(template: TemplateRef<any>) {
        // Update the selections from the list of selected ids.
        this.accounts.forEach(value => {
            value.selected = this.isAccountSelected(value.id);
        })

        this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    }

    selectAll() {
        this.modalRef.hide();

        this.filter.accounts = [];

        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.Account;
        this.filterChanged.emit(event);
    }

    selectAccounts() {
        this.modalRef.hide();

        // Get the selected id's and check to see if all items are selected.
        this.filter.accounts = [];
        let allSelected: boolean = true;
        let noneSelected: boolean = true;
        this.accounts.forEach(value => {
            if(value.selected) {
                this.filter.accounts.push(new JbAccount(value.id,null,null,null,null));
                noneSelected = false;
            } else {
                allSelected = false;
            }
        });

        // Fire the event.
        if(allSelected || noneSelected) {
            this.filter.accounts = [];
        }

        // Update filter event.
        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.Account;
        this.filterChanged.emit(event);
    }

    exit() {
        this.modalRef.hide();
    }

    changed(id: string){
        this.accounts.forEach(value => {
            if(value.id == id) {
                value.selected = !value.selected;
            }
        })
    }

    getChecked(id: string): boolean {
        // Find if the id provided is selected.
        let result: boolean = false;
        this.accounts.forEach(value => {
           if(id == value.id) {
               if(value.selected) {
                   result = true;
                   return;
               }
           }
        });

        return result;
    }
}
