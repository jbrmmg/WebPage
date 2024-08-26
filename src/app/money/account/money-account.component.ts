import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ButtonsModule} from "ngx-bootstrap/buttons";
import {NgClass, NgForOf, NgIf} from "@angular/common";
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
        NgClass
    ],
    standalone: true
})
export class MoneyAccount implements OnInit {
    columns: number = 4;
    accounts: AccountOption[][] = [];
    errorMessage: string;
    @Input() selectedAccountIds : string[];
    @Input() filterMode: boolean;
    @Input() allowClosed: boolean;
    @Output() cleared: EventEmitter<void> = new EventEmitter();
    @Output() selected: EventEmitter<JbAccount[]> = new EventEmitter();
    @Output() selectAccount: EventEmitter<JbAccount> = new EventEmitter();
    @Output() account: EventEmitter<string> = new EventEmitter();
    @Output() exit: EventEmitter<void> = new EventEmitter();

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

        this.selectedAccountIds.forEach(id => {
            if(item.id == id) {
                result = true;
                return;
            }
        })

        return result;
    }

    clickAccount(item: AccountOption) {
        if(!this.filterMode) {
            this.selectAccount.emit(item.account);
            return;
        }

        if(this.isAccountSelected(item)) {
            const index = this.selectedAccountIds.indexOf(item.id,0);

            if(index > -1) {
                this.selectedAccountIds.splice(index,1);
            }
        } else {
            this.selectedAccountIds.push(item.id);
        }
    }

    getAccountImage(item: AccountOption): string {
        return MoneyService.getAccountImage(item.id);
    }

    selectAll() {
        this.selectedAccountIds = [];

        // Add all to the selection.
        this.accounts.forEach(row => {
            row.forEach(col => {
                this.selectedAccountIds.push(col.id);
            });
        });
    }

    onExit() {
        this.exit.emit();
    }

    onClear() {
        this.selectedAccountIds = [];
        this.cleared.emit();
    }

    onOK() {
        let anySelected: boolean = false;
        let allSelected: boolean = true;
        let selection: JbAccount[] = [];

        this.accounts.forEach(row => {
            row.forEach(col => {
                if(this.isAccountSelected(col)) {
                    selection.push(col.account);
                    anySelected = true;
                } else {
                    allSelected = false;
                }
            });
        });

        if(allSelected || !anySelected) {
            this.cleared.emit();
        } else {
            this.selected.emit(selection);
        }
    }
}
