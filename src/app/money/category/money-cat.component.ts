import {Component, EventEmitter, Input, OnInit} from "@angular/core";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ButtonsModule} from "ngx-bootstrap/buttons";
import {MoneyService} from "../money.service";
import {Category} from "./category";
import {JbAccount} from "../account/jbAccount";
import {TransactionFilter} from "../transaction/transactionFilter";

class AccountOption {
    id: string;
    name: string;
    account: JbAccount;
}

@Component({
    selector: 'jbr-category',
    templateUrl: './money-cat.component.html',
    styleUrls: ['./money-cat.component.css'],
    imports: [
        NgForOf,
        ButtonsModule,
        NgIf,
        NgOptimizedImage
    ],
    host: {'style': 'padding: 0;'},
    standalone: true
})
export class MoneyCategory implements OnInit {
    columns: number = 4;
    categories: Category[][] = [];
    accounts: AccountOption[][] = [];
    errorMessage: string;

    @Input() filterMode: boolean;
    @Input() allowTransfer: boolean;
    @Input() filter : TransactionFilter;
    @Input() allSelected: boolean;

    @Input() selectCategoryEvent: EventEmitter<Category>;
    @Input() selectTransferEvent: EventEmitter<JbAccount>;

    constructor(private _moneyService: MoneyService) {
    }

    ngOnInit(): void {
        this._moneyService.getCategories().subscribe({
            next: (categories) => {
                let row: Category[] = [];
                this.categories.push(row);

                categories.forEach(value => {
                    if(row.length == this.columns) {
                        row = [];
                        this.categories.push(row);
                    }

                    row.push(value);
                })
            },
            error: (response) => this.errorMessage = response,
            complete: () => {
                console.log("Category Options Loaded")
            }
        });

        this._moneyService.getAccounts().subscribe({
            next: (accounts) => {
                let row: AccountOption[] = [];
                this.accounts.push(row);

                accounts.forEach(value => {
                    if(!value.closed) {
                        let next: AccountOption = new AccountOption();
                        next.id = value.id;
                        next.name = value.name;
                        next.account = value;

                        if (row.length == this.columns) {
                            row = [];
                            this.accounts.push(row);
                        }

                        row.push(next);
                    }
                })
            },
            error: (response) => this.errorMessage = response,
            complete: () => {
                console.log("Account Options Loaded")
            }
        })
    }

    getAccounts(): AccountOption[][] {
        if(!this.filterMode && this.allowTransfer) {
            return this.accounts;
        }

        return [];
    }

    clickTransfer(item: AccountOption) {
        this.selectTransferEvent.emit(item.account);
    }

    transferDisplay(item: AccountOption): string {
        return item.name;
    }

    isCategorySelected(item: Category): boolean {
        if(!this.filterMode) {
            return true;
        }

        let result: boolean = false;

        this.filter.categories.forEach(category => {
            if(item.id == category.id) {
                result = true;
            }
        })

        return result;
    }

    categoryDisplay(item: Category): string {
        return item.name + " (" + item.id + ")";
    }

    clickCategory(item: Category) {
        if(!this.filterMode) {
            if(item.systemUse) {
                return;
            }

            this.selectCategoryEvent.emit(item);
            return;
        }

        if(this.isCategorySelected(item)) {
            const index = this.filter.categories.findIndex(a => {return a.id == item.id});


            if(index > -1) {
                this.filter.categories.splice(index,1);
            }
        } else {
            this.filter.categories.push(item);
        }
    }

    backgroundColour(item: Category) {
        if(!this.filterMode && item.systemUse) {
            return '#FFFFFF';
        }

        if(this.isCategorySelected(item)) {
            return '#' + item.colour;
        }

        return '#FFFFFF';
    }

    textColour(item: Category) {
        if(!this.filterMode && item.systemUse) {
            return '#D3D3D3';
        }

        if(this.isCategorySelected(item)) {
            return '#' + MoneyService.getTextColor(this.backgroundColour(item).substring(1));
        }

        return '#000000';
    }

    borderColor(item: Category) {
        if(!this.filterMode && item.systemUse) {
            return '#D3D3D3';
        }

        if(this.isCategorySelected(item)) {
            return '#000000';
        }

        return '#' + item.colour;
    }

    onSelectAll() {
        this.filter.categories = [];

        // Add all to the selection.
        this.categories.forEach(row => {
            row.forEach(col => {
                this.filter.categories.push(col);
            })
        });
    }

    getAccountImage(item: AccountOption) {
        return MoneyService.getAccountImage(item.id);
    }
}
