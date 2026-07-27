import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MoneyService} from '../money.service';
import {JbAccount} from './jbAccount';
import {TransactionFilter} from '../transaction/transactionFilter';

class AccountOption {
    id: string;
    display: string;
    account: JbAccount;
    selected: boolean;
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
    columns = 4;
    accounts: AccountOption[][] = [];
    errorMessage: string;

    @Input() filterMode: boolean;
    @Input() allowClosed: boolean;
    @Input() filter: TransactionFilter;
    @Input() allSelected: boolean;

    @Input() selectEvent: EventEmitter<JbAccount>;

    constructor(private readonly _moneyService: MoneyService) {
    }

    ngOnInit(): void {
        this._moneyService.getAccounts().subscribe({
            next: (accounts) => {
                let row: AccountOption[] = [];
                this.accounts.push(row);

                accounts.forEach(value => {
                    const next: AccountOption = new AccountOption();
                    let allowed = true;
                    next.display = value.name;
                    if (value.closed) {
                        next.display += ' (closed)';

                        if (!this.allowClosed) {
                            allowed = false;
                        }
                    }
                    next.id = value.id;
                    next.account = value;
                    next.selected = this.isAccountSelected(next);

                    if (row.length === this.columns) {
                        row = [];
                        this.accounts.push(row);
                    }

                    if (allowed) {
                        row.push(next);
                    }
                });
            },
            error: (response) => this.errorMessage = response,
            complete: () => {
                console.log('✅ Account Options Loaded');
            }
        });
    }

    isAccountSelected(item: AccountOption): boolean {
        if (!this.filterMode) {
            return false;
        }

        let result = false;

        this.filter.accounts.forEach(account => {
            if (account.id === item.id) {
                result = true;
            }
        });

        return result;
    }

    clickAccount(item: AccountOption) {
        if (!this.filterMode) {
            this.selectEvent.emit(item.account);
            return;
        }

        if (this.isAccountSelected(item)) {
            item.selected = false;
            const index = this.filter.accounts.findIndex(a => a.id === item.id);

            if (index > -1) {
                this.filter.accounts.splice(index, 1);
            }
        } else {
            item.selected = true;
            this.filter.accounts.push(item.account);
        }

        // Set the all selected flag if we have selected all accounts.
        this.allSelected = (this.filter.accounts.length === this.accounts.length);
    }

    getAccountImage(item: AccountOption): string {
        return MoneyService.getAccountImage(item.id);
    }

    selectAll() {
        this.filter.accounts = [];

        // Add all to the selection.
        this.accounts.forEach(row => {
            row.forEach(col => {
                col.selected = true;
                this.filter.accounts.push(col.account);
            });
        });
        this.allSelected = true;
    }
}
