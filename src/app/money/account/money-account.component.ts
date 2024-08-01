import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ButtonsModule} from "ngx-bootstrap/buttons";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MoneyService} from "../money.service";
import {JbAccount} from "./jbaccount";
import {Category} from "../category/category";

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
    @Output() selected: EventEmitter<string[]> = new EventEmitter();
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
                    next.display = value.name;
                    if(value.closed) {
                        next.display += " (closed)";
                    }
                    next.id = value.id;
                    next.account = value;

                    if(row.length == this.columns) {
                        row = [];
                        this.accounts.push(row);
                    }

                    row.push(next);
                })
            },
            error: (response) => this.errorMessage = <any> response,
            complete: () => {
                console.log("Account Options Loaded")
            }
        });
    }

    isAccountSelected(item: JbAccount): boolean {
        if(!this.filterMode) {
            return true;
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
}
