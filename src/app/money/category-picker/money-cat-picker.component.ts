import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Category, ICategory} from "../money-category";
import {MoneyService} from "../money.service";
import {JbAccount} from "../money-account";
import {forEach} from "@angular/router/src/utils/collection";

export class MoneyCategoryPickerSelectableOption {
    category: ICategory;
    accountTransfer: JbAccount;
    rightMargin: string;
    bottomMargin: string;
}

@Component({
    selector: 'money-category-picker',
    templateUrl: './money-cat-picker.component.html',
    styleUrls: ['./money-cat-picker.component.css']
})
export class MoneyCatagoryPickerComponent implements OnInit {
    static readonly defaultMargin = "1px";

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

    constructor(private _moneyService : MoneyService){
        this.columns = 3;
        this.showAccountTransfers = false;
        this.showSystem = false;
        this.rows = 0;
        this.multiSelect = false;
        this.columnSpacing = MoneyCatagoryPickerComponent.defaultMargin;
        this.rowSpacing = MoneyCatagoryPickerComponent.defaultMargin;
        this.selections = null;
    }

    ngOnInit(): void {
        this._moneyService.getCatories().subscribe(
            categories => {
                this.categories = categories;
            },
            error => this.errorMessage = <any>error,
            () => {
                for(let nextCategory of this.categories) {
                    if(nextCategory.id == "TRF") {
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
        )
    }

    calculateColumnRow(): void {
        if (this.categories == null) {
            return;
        }

        if(this.showAccountTransfers && (this.accounts == null)) {
            return;
        }

        // Reset the selectable options.
        this.selectableOption = [];

        // Get a list of selectable options.
        let i = 0;
        for(let nextCategory of this.categories) {
            if(this.showSystem && (nextCategory.systemUse)) {
                this.selectableOption[i] = new MoneyCategoryPickerSelectableOption();
                this.selectableOption[i].accountTransfer = null;
                this.selectableOption[i].category = nextCategory;
                this.selectableOption[i].rightMargin = this.columnSpacing;
                this.selectableOption[i].bottomMargin = this.rowSpacing;
                i++;
            }
            if(!nextCategory.systemUse) {
                console.log(nextCategory.id);
                this.selectableOption[i] = new MoneyCategoryPickerSelectableOption();
                this.selectableOption[i].accountTransfer = null;
                this.selectableOption[i].category = nextCategory;
                this.selectableOption[i].rightMargin = this.columnSpacing;
                this.selectableOption[i].bottomMargin = this.rowSpacing;
                i++;
            }
        }

        // If account transfers are to be shown add them to selectable otpions.
        if(this.showAccountTransfers) {
            for (let nextAccount of this.accounts) {
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
        for(let r = 0; r < this.rows; r++) {
            this.coordinates[r] = [];

            for(let c = 0; c < this.columns; c++ ) {
                if(i < this.selectableOption.length) {
                    this.coordinates[r][c] = i;

                    // If this is the bottom row or the right column, then remove the margin.
                    if(r == this.rows - 1) {
                        this.selectableOption[i].bottomMargin = MoneyCatagoryPickerComponent.defaultMargin;
                    }

                    if(c == this.columns - 1) {
                        this.selectableOption[i].rightMargin = MoneyCatagoryPickerComponent.defaultMargin;
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
        if (id == -1) {
            return null;
        }

        if (id < this.selectableOption.length) {
            return this.selectableOption[id];
        }

        return null;
    }

    getCategoryColour(id: number) : string {
        let selectableOption = this.getSelectedOption(id);

        if(selectableOption != null)
        {
            if(selectableOption.accountTransfer != null) {
                return "#" + selectableOption.accountTransfer.colour;
            }

            return "#" + selectableOption.category.colour;
        }

        return "#FFFFFF";
    }

    getCategoryBrightness(id: number) : number {
        let selectableOption = this.getSelectedOption(id);

        if(selectableOption != null) {
            if(selectableOption.accountTransfer != null) {
                return MoneyService.getBrightness(selectableOption.accountTransfer.colour);
            }

            return MoneyService.getBrightness(selectableOption.category.colour);
        }

        return 0;
    }

    getCategoryTextColour(id: number) : string {
        return this.getCategoryBrightness(id) > 130 ? "#000000" : "#FFFFFF";
    }

    onClickCategory(id: number): void {
        let selectableOption = this.getSelectedOption(id);

        if(selectableOption != null) {
            if(this.multiSelect) {
                this.selections.forEach(nextCategory => {
                    if(nextCategory.id == selectableOption.category.id) {
                        nextCategory.selected = !nextCategory.selected;
                    }
                });
            }

            console.log(selectableOption.category.id + "-> " + selectableOption.category.name);
            this.valueSelected.emit(selectableOption);
        }
    }

    category(id: number): ICategory {
        let selectableOption = this.getSelectedOption(id);

        if(selectableOption != null) {
            return selectableOption.category;
        }

        return null;
    }

    hasImage(id: number): boolean {
        let selectableOption = this.getSelectedOption(id);

        if(selectableOption != null) {
            if(selectableOption.accountTransfer != null) {
                return true;
            }
        }

        return false;
    }

    getImage(id: number): string {
        let selectableOption = this.getSelectedOption(id);

        if(selectableOption != null) {
            if(selectableOption.accountTransfer != null) {
                return MoneyService.getAccountImage(selectableOption.accountTransfer.id);
            }
        }

        return "";
    }

    getRightMargin(id: number): string {
        let selectableOption = this.getSelectedOption(id);

        if(selectableOption != null) {
            return selectableOption.rightMargin;
        }

        return MoneyCatagoryPickerComponent.defaultMargin;
    }

    getBottomMargin(id: number): string {
        let selectableOption = this.getSelectedOption(id);

        if(selectableOption != null) {
            return selectableOption.bottomMargin;
        }

        return MoneyCatagoryPickerComponent.defaultMargin;
    }

    selected(id: number): boolean {
        let selectableOption = this.getSelectedOption(id);

        let selected = false;
        this.selections.forEach(nextCategory => {
            if(nextCategory.id == selectableOption.category.id) {
                if(nextCategory.selected) {
                    selected = true;
                } else {
                    selected = false;
                }
            }
        });

        return selected;
    }

    selectAll() {
        this.selections.forEach(nextCategory => {
            nextCategory.selected = true;
        })

        if (this.selectableOption.length > 0) {
            this.valueSelected.emit(this.selectableOption[0]);
        }
    }

    selectNone() {
        this.selections.forEach(nextCategory => {
            nextCategory.selected = false;
        })

        if (this.selectableOption.length > 0) {
            this.valueSelected.emit(this.selectableOption[0]);
        }
    }

    exit() {
        this.complete.emit();
    }
}
