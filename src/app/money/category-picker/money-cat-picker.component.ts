import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Category, ICategory} from '../money-category';
import {MoneyService} from '../money.service';
import {JbAccount} from '../money-account';

export class MoneyCategoryPickerSelectableOption {
    category: ICategory;
    accountTransfer: JbAccount;
    rightMargin: string;
    bottomMargin: string;
}

@Component({
    selector: 'jbr-money-category-picker',
    templateUrl: './money-cat-picker.component.html',
    styleUrls: ['./money-cat-picker.component.css']
})
export class MoneyCategoryPickerComponent implements OnInit {
    static readonly defaultMargin = '1px';

    selectableOption: MoneyCategoryPickerSelectableOption[];
    categories: ICategory[];
    accounts: JbAccount[];
    errorMessage: string;
    categoryRadio: string;
    transferCategory: ICategory;
    coordinates: number[][];
    rows: number;

    @Input() columns: number;
    @Input() showAccountTransfers: boolean;
    @Input() showSystem: boolean;
    @Input() multiSelect: boolean;
    @Input() columnSpacing: string;
    @Input() rowSpacing: string;
    @Input() selections: Category[];

    @Output() valueSelected: EventEmitter<MoneyCategoryPickerSelectableOption> = new EventEmitter<MoneyCategoryPickerSelectableOption>();
    @Output() complete: EventEmitter<void> = new EventEmitter<void>();

    constructor(private _moneyService: MoneyService) {
        this.columns = 3;
        this.showAccountTransfers = false;
        this.showSystem = false;
        this.rows = 0;
        this.multiSelect = false;
        this.columnSpacing = MoneyCategoryPickerComponent.defaultMargin;
        this.rowSpacing = MoneyCategoryPickerComponent.defaultMargin;
        this.selections = null;
    }

    ngOnInit(): void {
        this._moneyService.getCategories().subscribe(
            categories => {
                this.categories = categories;
            },
            error => this.errorMessage = <any>error,
            () => {
                for (const nextCategory of this.categories) {
                    if (nextCategory.id === 'TRF') {
                        this.transferCategory = nextCategory;
                    }
                }

                this.calculateColumnRow();
            }
        );
        this._moneyService.getAccounts().subscribe(
            accounts => {
                this.accounts = accounts;
            },
            error => this.errorMessage = <any>error,
            () => {
                this.calculateColumnRow();
            }
        );
    }

    calculateColumnRow(): void {
        if (this.categories == null) {
            return;
        }

        if (this.showAccountTransfers && (this.accounts == null)) {
            return;
        }

        // Reset the selectable options.
        this.selectableOption = [];

        // Get a list of selectable options.
        let i = 0;
        for (const nextCategory of this.categories) {
            if (this.showSystem || (!nextCategory.systemUse)) {
                this.selectableOption[i] = new MoneyCategoryPickerSelectableOption();
                this.selectableOption[i].accountTransfer = null;
                this.selectableOption[i].category = nextCategory;
                this.selectableOption[i].rightMargin = this.columnSpacing;
                this.selectableOption[i].bottomMargin = this.rowSpacing;
                i++;
            }
        }

        // If account transfers are to be shown add them to selectable options.
        if (this.showAccountTransfers) {
            for (const nextAccount of this.accounts) {
                this.selectableOption[i] = new MoneyCategoryPickerSelectableOption();
                this.selectableOption[i].category = this.transferCategory;
                this.selectableOption[i].accountTransfer = nextAccount;
                this.selectableOption[i].rightMargin = this.columnSpacing;
                this.selectableOption[i].bottomMargin = this.rowSpacing;
                i++;
            }
        }

        // Set the row columns of the options.
        this.rows = this.selectableOption.length / this.columns;
        this.coordinates = [];

        i = 0;
        for (let r = 0; r < this.rows; r++) {
            this.coordinates[r] = [];

            for (let c = 0; c < this.columns; c++ ) {
                if (i < this.selectableOption.length) {
                    this.coordinates[r][c] = i;

                    // If this is the bottom row or the right column, then remove the margin.
                    if (r === this.rows - 1) {
                        this.selectableOption[i].bottomMargin = MoneyCategoryPickerComponent.defaultMargin;
                    }

                    if (c === this.columns - 1) {
                        this.selectableOption[i].rightMargin = MoneyCategoryPickerComponent.defaultMargin;
                    }

                    // Move to next.
                    i++;
                } else {
                    this.coordinates[r][c] = -1;
                }
            }
        }
    }

    private getSelectedOption(id: number): MoneyCategoryPickerSelectableOption {
        if (id === -1) {
            return null;
        }

        if (id < this.selectableOption.length) {
            return this.selectableOption[id];
        }

        return null;
    }

    getCategoryColour(id: number): string {
        const selectableOption = this.getSelectedOption(id);

        if (selectableOption != null) {
            if (selectableOption.accountTransfer != null) {
                return '#' + selectableOption.accountTransfer.colour;
            }

            return '#' + selectableOption.category.colour;
        }

        return '#FFFFFF';
    }

    getCategoryBrightness(id: number): number {
        const selectableOption = this.getSelectedOption(id);

        if (selectableOption != null) {
            if (selectableOption.accountTransfer != null) {
                return MoneyService.getBrightness(selectableOption.accountTransfer.colour);
            }

            return MoneyService.getBrightness(selectableOption.category.colour);
        }

        return 0;
    }

    getCategoryTextColour(id: number): string {
        return this.getCategoryBrightness(id) > 130 ? '#000000' : '#FFFFFF';
    }

    onClickCategory(id: number): void {
        const selectableOption = this.getSelectedOption(id);

        if (selectableOption != null) {
            if (this.multiSelect) {
                this.selections.forEach(nextCategory => {
                    if (nextCategory.id === selectableOption.category.id) {
                        nextCategory.selected = !nextCategory.selected;
                    }
                });
            }

            console.log(selectableOption.category.id + '-> ' + selectableOption.category.name);
            this.valueSelected.emit(selectableOption);
        }
    }

    category(id: number): ICategory {
        const selectableOption = this.getSelectedOption(id);

        if (selectableOption != null) {
            return selectableOption.category;
        }

        return null;
    }

    hasImage(id: number): boolean {
        const selectableOption = this.getSelectedOption(id);

        if (selectableOption != null) {
            if (selectableOption.accountTransfer != null) {
                return true;
            }
        }

        return false;
    }

    getImage(id: number): string {
        const selectableOption = this.getSelectedOption(id);

        if (selectableOption != null) {
            if (selectableOption.accountTransfer != null) {
                return MoneyService.getAccountImage(selectableOption.accountTransfer.id);
            }
        }

        return '';
    }

    getRightMargin(id: number): string {
        const selectableOption = this.getSelectedOption(id);

        if (selectableOption != null) {
            return selectableOption.rightMargin;
        }

        return MoneyCategoryPickerComponent.defaultMargin;
    }

    getBottomMargin(id: number): string {
        const selectableOption = this.getSelectedOption(id);

        if (selectableOption != null) {
            return selectableOption.bottomMargin;
        }

        return MoneyCategoryPickerComponent.defaultMargin;
    }

    selected(id: number): boolean {
        const selectableOption = this.getSelectedOption(id);

        let selected = false;
        this.selections.forEach(nextCategory => {
            if (nextCategory.id === selectableOption.category.id) {
                selected = nextCategory.selected;
            }
        });

        return selected;
    }

    selectAll() {
        if (this.selections == null) {
            return;
        }

        this.selections.forEach(nextCategory => {
            nextCategory.selected = true;
        });

        if (this.selectableOption.length > 0) {
            this.valueSelected.emit(this.selectableOption[0]);
        }
    }

    selectNone() {
        if (this.selections == null) {
            return;
        }

        this.selections.forEach(nextCategory => {
            nextCategory.selected = false;
        });

        if (this.selectableOption.length > 0) {
            this.valueSelected.emit(this.selectableOption[0]);
        }
    }

    exit() {
        this.complete.emit();
    }
}
