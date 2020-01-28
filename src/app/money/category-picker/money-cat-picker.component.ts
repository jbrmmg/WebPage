import {Component, Input, OnInit} from "@angular/core";
import {ICategory} from "../money-category";
import {MoneyService} from "../money.service";
import {JbAccount} from "../money-account";

class MoneyCategoryPickerSelectableOption {
    category: ICategory;
    accountTransfer: JbAccount;
}

@Component({
    selector: 'money-category-picker',
    templateUrl: './money-cat-picker.component.html',
    styleUrls: ['./money-cat-picker.component.css']
})
export class MoneyCatagoryPickerComponent implements OnInit {

    selectableOption: MoneyCategoryPickerSelectableOption[];

    categories: ICategory[];
    accounts: JbAccount[];
    errorMessage: string;
    selectedCategory: ICategory;
    categoryRadio: string;
    transferCategory: ICategory;

    coordinates: number[][];

    @Input() columns: number;
    @Input() showAccountTransfers: boolean;
    @Input() showSystem: boolean;
    rows: number;

    constructor(private _moneyService : MoneyService){
        this.columns = 3;
        this.showAccountTransfers = false;
        this.showSystem = false;
        this.rows = 0;
    }

    ngOnInit(): void {
        this._moneyService.getCatories().subscribe(
            categories => {
                this.categories = categories;
            },
            error => this.errorMessage = <any>error,
            () => {
                this.calculateColumnRow();

                for(let nextCategory of this.categories) {
                    if(nextCategory.id = "TRF") {
                        this.transferCategory = nextCategory;
                    }
                }
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
        this.selectableOption = [];

        // Get a list of selectable options.
        let i = 0;
        for(let nextCategory of this.categories) {
            if(this.showSystem && nextCategory.systemUse == "Y") {
                this.selectableOption[i] = new MoneyCategoryPickerSelectableOption();
                this.selectableOption[i].accountTransfer = null;
                this.selectableOption[i].category = nextCategory;
            } else if ( nextCategory.systemUse == "N" ) {
                this.selectableOption[i] = new MoneyCategoryPickerSelectableOption();
                this.selectableOption[i].accountTransfer = null;
                this.selectableOption[i].category = nextCategory;
            }
            i++;
        }

        // If account transfers are to be shown add them to selectable otpions.
        if(this.showAccountTransfers) {
            for (let nextAccount of this.accounts) {
                this.selectableOption[i] = new MoneyCategoryPickerSelectableOption();
                this.selectableOption[i].category = this.transferCategory;
                this.selectableOption[i].accountTransfer = nextAccount;
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
                } else {
                    this.coordinates[r][c] = -1;
                }
                i++;
            }
        }
    }

    private getSelectedOption(id: number): MoneyCategoryPickerSelectableOption {
        if(id == -1) {
            return null;
        }

        if(id < this.selectableOption.length) {
            return this.selectableOption[id];
        }

        return null;
    }

    private getCategoryWithId(id: number): ICategory {
        let selectableOption = this.getSelectedOption(id);

        if(selectableOption != null) {
            return selectableOption.category;
        }

        return null;
    }

    getCategoryColour(id: number) : string {
        let selectableOption = this.getSelectedOption(id);

        if(selectableOption != null)
        {
            return "#" + selectableOption.category.colour;
        }

        return "#FFFFFF";
    }

    getCategoryBrightness(id: number) : number {
        let selectableOption = this.getSelectedOption(id);

        if(selectableOption != null) {
            return MoneyService.getBrightness(selectableOption.category.colour);
        }

        return 0;
    }

    getCategoryTextColour(id: number) : string {
        return this.getCategoryBrightness(id) > 130 ? "#000000" : "#FFFFFF";
    }

    onClickCategory(id: number): void {
//        this.selectedCategory = null;
//        this.selectedXferAcc = null;
        let selectableOption = this.getSelectedOption(id);

        if(selectableOption != null) {
            this.selectedCategory = selectableOption.category;
        }
    }

    category(id: number): ICategory {
        let selectableOption = this.getSelectedOption(id);

        if(selectableOption != null) {
            return selectableOption.category;
        }

        return null;
    }
}
