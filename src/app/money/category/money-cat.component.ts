import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {NgForOf, NgIf} from "@angular/common";
import {ButtonsModule} from "ngx-bootstrap/buttons";
import {MoneyService} from "../money.service";
import {Category} from "./category";

class AccountOption {
    id: string;
    name: string;
}

@Component({
    selector: 'jbr-category',
    templateUrl: './money-cat.component.html',
    styleUrls: ['./money-cat.component.css'],
    imports: [
        NgForOf,
        ButtonsModule,
        NgIf
    ],
    standalone: true
})
export class MoneyCategory implements OnInit {
    columns: number = 4;
    categories: Category[][] = [];
    accounts: AccountOption[][] = [];
    errorMessage: string;
    @Input() selectedCategoryIds : string[];
    @Input() filterMode: boolean;
    @Input() allowTransfer: boolean;
    @Output() cleared: EventEmitter<void> = new EventEmitter();
    @Output() selected: EventEmitter<string[]> = new EventEmitter();
    @Output() selectCategory: EventEmitter<Category> = new EventEmitter();
    @Output() account: EventEmitter<string> = new EventEmitter();
    @Output() exit: EventEmitter<void> = new EventEmitter();

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
            error: (response) => this.errorMessage = <any> response,
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

                        if (row.length == this.columns) {
                            row = [];
                            this.accounts.push(row);
                        }

                        row.push(next);
                    }
                })
            },
            error: (response) => this.errorMessage = <any> response,
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
        this.account.emit(item.id);
    }

    transferDisplay(item: AccountOption): string {
        return item.name;
    }

    isCategorySelected(item: Category): boolean {
        if(!this.filterMode) {
            return true;
        }

        let result: boolean = false;

        this.selectedCategoryIds.forEach(id => {
            if(item.id == id) {
                result = true;
                return;
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

            this.selectCategory.emit(item);
            return;
        }

        if(this.isCategorySelected(item)) {
            const index = this.selectedCategoryIds.indexOf(item.id,0);

            if(index > -1) {
                this.selectedCategoryIds.splice(index,1);
            }
        } else {
            this.selectedCategoryIds.push(item.id);
        }
    }

    onClear() {
        this.cleared.emit();
    }

    onExit() {
        this.exit.emit();
    }

    onOK() {
        // Are all the values the same?
        let anySelected: boolean = false;
        let allSelected: boolean = true;
        let selection: string[] = [];

        this.categories.forEach(row => {
            row.forEach(col => {
                if(this.isCategorySelected(col)) {
                    selection.push(col.id);
                    anySelected = true;
                } else {
                    allSelected = false;
                }
            })
        });

        if(allSelected || !anySelected) {
            this.cleared.emit();
        } else {
            this.selected.emit(selection);
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
        this.selectedCategoryIds = [];

        // Add all to the selection.
        this.categories.forEach(row => {
            row.forEach(col => {
                this.selectedCategoryIds.push(col.id);
            })
        });
    }

    getAccountImage(item: AccountOption) {
        return MoneyService.getAccountImage(item.id);
    }
}
