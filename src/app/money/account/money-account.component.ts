import {Component, EventEmitter, Input, OnInit} from "@angular/core";
import {ButtonsModule} from "ngx-bootstrap/buttons";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MoneyService} from "../money.service";
import {JbAccount} from "./jbAccount";

class AccountOption {
    id: string;
    display: string;
    account: JbAccount;
}

@Component({
    selector: 'jbr-account',
    templateUrl: './money-account.component.html',
    styleUrls: ['./money-account.component.css'],
    imports: [
        ButtonsModule,
        NgForOf,
        NgIf,
        FormsModule,
        NgClass,
        NgOptimizedImage
    ],
    host: {'style': 'padding: 0;'},
    standalone: true
})
export class MoneyAccount implements OnInit {
    columns: number = 4;
    accounts: AccountOption[][] = [];
    errorMessage: string;

    @Input() filterMode: boolean;
    @Input() allowClosed: boolean;
    @Input() selectedAccounts: JbAccount[];
    @Input() allSelected: boolean;

    @Input() selectEvent: EventEmitter<JbAccount>;

    constructor(private _moneyService: MoneyService) {
    }

    ngOnInit(): void {
        this._moneyService.getAccounts().subscribe({
            next: (accounts) => {
                let row: AccountOption[] = [];
                this.accounts.push(row);

                accounts.forEach(value => {
                    let next: AccountOption = new AccountOption();
                    let allowed: boolean = true;
                    next.display = value.name;
                    if(value.closed) {
                        next.display += " (closed)";

                        if(!this.allowClosed) {
                            allowed = false;
                        }
                    }
                    next.id = value.id;
                    next.account = value;

                    if(row.length == this.columns) {
                        row = [];
                        this.accounts.push(row);
                    }

                    if(allowed) {
                        row.push(next);
                    }
                })
            },
            error: (response) => this.errorMessage = <any> response,
            complete: () => {
                console.log("Account Options Loaded")
            }
        });
    }

    isAccountSelected(item: AccountOption): boolean {
        if(!this.filterMode) {
            return false;
        }

        let result: boolean = false;

        this.selectedAccounts.forEach(account => {
            if(account.id == item.id) {
                result = true;
                return;
            }
        });

        return result;
    }

    clickAccount(item: AccountOption) {
        if(!this.filterMode) {
            this.selectEvent.emit(item.account);
            return;
        }

        if(this.isAccountSelected(item)) {
            const index = this.selectedAccounts.indexOf(item.account,0);

            if(index > -1) {
                this.selectedAccounts.splice(index,1);
            }
        } else {
            this.selectedAccounts.push(item.account);
        }

        // Set the all selected flag if we have selected all accounts.
        this.allSelected = (this.selectedAccounts.length == this.accounts.length);
    }

    getAccountImage(item: AccountOption): string {
        return MoneyService.getAccountImage(item.id);
    }

    selectAll() {
        this.selectedAccounts = [];

        // Add all to the selection.
        this.accounts.forEach(row => {
            row.forEach(col => {
                this.selectedAccounts.push(col.account);
            });
        });
        this.allSelected = true;
    }
}
