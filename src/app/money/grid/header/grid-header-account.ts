import {Component, Input, OnInit, TemplateRef} from "@angular/core";
import {ButtonsModule} from "ngx-bootstrap/buttons";
import {NgForOf, NgIf} from "@angular/common";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {MoneyService} from "../../money.service";

class AccountFilterOption {
    id: string;
    display: string;
    all: boolean;
}

@Component({
    selector: 'jbr-grid-header-account',
    templateUrl: './grid-header-account.html',
    styleUrls: ['./grid-header-account.css'],
    imports: [
        ButtonsModule,
        NgForOf,
        NgIf
    ],
    standalone: true
})
export class GridHeaderAccount implements OnInit{
    @Input() header: string;
    filter: string;
    modalRef: BsModalRef;
    accounts: AccountFilterOption[] = [];
    errorMessage: string;

    constructor(private modalService: BsModalService,
                private _moneyService: MoneyService ) {
        let all: AccountFilterOption = new AccountFilterOption();
        all.id = "";
        all.display = "All"
        all.all = true;

        this.accounts.push(all)
        this.filter = "(all)";
    }

    ngOnInit(): void {
        this._moneyService.getAccounts().subscribe({
            next: (accounts) => {
                accounts.forEach(value => {
                    let next: AccountFilterOption = new AccountFilterOption();
                    next.all = false;
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

    getAccountImage(id: string) : string {
        return MoneyService.getAccountImage(id);
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    }
}
