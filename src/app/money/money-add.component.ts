import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {Component, OnInit} from "@angular/core";
import {MoneyService, NewTransaction} from "./money.service";
import {ICategory} from "./money-category";
import {IAccount, JbAccount} from "./money-account";
import {DatePipe} from "@angular/common";

@Component({
    templateUrl: './money-add.component.html',
    styleUrls: ['./money-add.component.css']
})
export class MoneyAddComponent implements OnInit {
    categories: ICategory[];
    accounts: JbAccount[];
    errorMessage: string;
    internalDate: Date = new Date();
    categoryRadio: string;
    accountRadio: string;

    // Transaction details.
    statusMonth: string = 'September';
    statusYear: string = '2019';
    statusDay: string = '24';
    selectedAccount: IAccount = null;
    selectedCategory: ICategory = null;
    selectedXferAcc: IAccount = null;
    transactionAmount: number = 0;
    private readonly categoryImageTemplate: string;

    constructor(private _moneyService : MoneyService,
                public datepipe: DatePipe,
                private sanitizer: DomSanitizer) {

        // Setup the template for the category image.
        this.categoryImageTemplate = "<svg ##viewbox## width='98%' height='98%'>".replace("##viewbox##","viewBox='0 0 100 100'");
        this.categoryImageTemplate += "<circle cx='50' cy='50' r='48' style='stroke:#006600; fill:###colour##'/>";
        this.categoryImageTemplate += "<text x='50' y='50' text-anchor='middle' font-weight='bolder'>##text##</text>";
        this.categoryImageTemplate += "</svg>"
    }

    get filteredCatgories() : ICategory[] {
        return this.categories.filter((category: ICategory) =>
            category.systemUse == "N")
    }

    get bsValue(): Date {
        return this.internalDate;
    }

    get transactionAmtDisplay() : string {
        if (this.transactionAmount < 0)
            return this.transactionAmount.toFixed(2).replace("-","-£");

        return "£" + this.transactionAmount.toFixed(2);
    }

    get selectedCategoryImage() : SafeHtml {
        let colour: string = "FFFFFF";
        let text: string = "?";
        if(this.selectedCategory != null) {
            colour = this.selectedCategory.colour;
            text = this.selectedCategory.id;
        }

        let html = this.categoryImageTemplate.replace("##colour##",colour).replace("##text##",text);
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    get transactionValid() : boolean {
        if(this.internalDate == null) {
            return false;
        }

        if(this.transactionAmount == 0) {
            return false;
        }

        if(this.selectedAccount == null) {
            return false;
        }

        if(this.selectedCategory == null && this.selectedXferAcc == null ) {
            return false;
        }

        if(this.selectedXferAcc != null) {
            if(this.selectedXferAcc.id == this.selectedAccount.id) {
                return false;
            }
        }

        return true;
    }

    get statusClass(): string {
        if(!this.transactionValid) {
            return "card text-black status-text-error mb-3";
        }

        return "card text-black status-text-success mb-3";
    }

    set bsValue(newValue: Date) {
        if(newValue == null)
            return;
        this.internalDate = newValue;
    }

    ngOnInit(): void {
        this._moneyService.getCatories().subscribe(
            categories => {
                this.categories = categories;
            },
            error => this.errorMessage = <any>error
        );
        this._moneyService.getAccounts().subscribe(
            accounts => {
                this.accounts = accounts;
            },
            error => this.errorMessage = <any>error
        )
    }

    getImage(id: string): string {
        return MoneyService.getAccountImage(id);
    }

    getCategoryColour(index: number) : string {
        if(index < this.categories.length)
        {
            return "#" + this.categories[index].colour;
        }

        return "#FFFFFF";
    }

    getAccountColour(index: number) : string {
        if(index < this.accounts.length)
        {
            return "#" + this.accounts[index].colour;
        }

        return "#FFFFFF";
    }

    getCategoryTextColour(index: number) : string {
        return this.getCategoryBrightness(index) > 130 ? "#000000" : "#FFFFFF";
    }

    getAccountTextColour(index: number) : string {
        return this.getAccountBrightness(index) > 130 ? "#000000" : "#FFFFFF";
    }

    getCategoryBrightness(index: number) : number {
        if(index < this.categories.length) {
            return MoneyService.getBrightness(this.categories[index].colour);
        }

        return 0;
    }

    getAccountBrightness(index: number): number {
        if(index < this.accounts.length) {
            return MoneyService.getBrightness(this.accounts[index].colour);
        }

        return 0;
    }

    onDateChange(newDate: Date): void {
        console.info("Date Changed " + (newDate == null ? "is null " : "not"));
        this.bsValue = newDate;

        this.statusMonth = this.datepipe.transform(this.bsValue,'MMMM');
        this.statusDay = this.datepipe.transform(this.bsValue,'d');
        this.statusYear = this.datepipe.transform(this.bsValue,'yyyy');
    }

    onClickCategory(index: number): void {
        this.selectedCategory = null;
        this.selectedXferAcc = null;

        if(index < this.categories.length) {
            this.selectedCategory = this.categories[index];
        }
    }

    onClickTransfer(index: number): void {
        this.selectedCategory = null;
        this.selectedXferAcc = null;

        if(index < this.accounts.length) {
            this.selectedXferAcc = this.accounts[index];
        }

        console.info("Index Selected - " + index.toString() + " " + this.selectedXferAcc.id);
    }


    onClickAccount(id: string): void {
        this.selectedAccount = null;

        this.accounts.forEach(nextAccount => {
            if(nextAccount.id == id) {
                this.selectedAccount = nextAccount;
            }
        })
    }

    onAmountEntered(value: number){
        console.info("Entered = " + value);

        this.transactionAmount = value;
    }

    onClickCreate() {
        console.info("Create transaction:");

        if(this.transactionValid) {
            let newTransaction: NewTransaction = new NewTransaction();
            newTransaction.amount = this.transactionAmount;
            newTransaction.date = this.internalDate;
            newTransaction.account = this.selectedAccount.id;
            if(this.selectedXferAcc != null) {
                newTransaction.accountTransfer = true;
                newTransaction.transferAccount = this.selectedXferAcc.id;
                newTransaction.category = "TRF";
            } else {
                newTransaction.accountTransfer = false;
                newTransaction.category = this.selectedCategory.id;
            }

            this._moneyService.addTransaction(newTransaction);
        }

        // Clear the details.
        this.transactionAmount = 0;
        this.selectedAccount = null;
        this.selectedCategory = null;
    }
}
