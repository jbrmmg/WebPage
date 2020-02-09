import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {Component, OnInit, TemplateRef} from "@angular/core";
import {MoneyService, NewTransaction} from "./money.service";
import {ICategory} from "./money-category";
import {IAccount, JbAccount} from "./money-account";
import {DatePipe} from "@angular/common";
import {MoneyCategoryPickerSelectableOption} from "./category-picker/money-cat-picker.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap";

@Component({
    templateUrl: './money-add.component.html',
    styleUrls: ['./money-add.component.css']
})
export class MoneyAddComponent implements OnInit {
    categories: ICategory[];
    accounts: JbAccount[];
    errorMessage: string;
    internalDate: Date = new Date();
    accountRadio: string;
    isCollapsed: boolean;

    // Transaction details.
    statusMonth: string = 'September';
    statusYear: string = '2019';
    statusDay: string = '24';
    selectedAccount: IAccount = null;
    selectedCategory: ICategory = null;
    selectedXferAcc: IAccount = null;
    transactionAmount: number = 0;

    modalRef: BsModalRef;

    constructor(private _moneyService : MoneyService,
                public datepipe: DatePipe,
                private sanitizer: DomSanitizer,
                private modalService: BsModalService) {

        this.isCollapsed = true;
    }

    get bsValue(): Date {
        return this.internalDate;
    }

    get transactionAmtDisplay() : string {
        if (this.transactionAmount < 0)
            return this.transactionAmount.toFixed(2).replace("-","-£");

        return "£" + this.transactionAmount.toFixed(2);
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

    getSelectedAcountColour() : string {
        if(this.selectedAccount != null) {
            return "#" + this.selectedAccount.colour;
        }

        return "#3277A8";
    }

    getSelectedCategoryColour() : string {
        if(this.selectedCategory != null) {
            return "#" + this.selectedCategory.colour;
        }

        return "#3277A8";
    }

    getSelectedCategoryText() : string {
        if(this.selectedCategory != null) {
            return this.selectedCategory.name;
        }

        return "?";
    }

    getAccountColour(index: number) : string {
        if(index < this.accounts.length)
        {
            return "#" + this.accounts[index].colour;
        }

        return "#FFFFFF";
    }

    onDateChange(newDate: Date): void {
        console.info("Date Changed " + (newDate == null ? "is null " : "not"));
        this.bsValue = newDate;

        this.statusMonth = this.datepipe.transform(this.bsValue,'MMMM');
        this.statusDay = this.datepipe.transform(this.bsValue,'d');
        this.statusYear = this.datepipe.transform(this.bsValue,'yyyy');

        this.modalRef.hide();
    }

    onClickAccount(id: string): void {
        this.selectedAccount = null;

        this.accounts.forEach(nextAccount => {
            if(nextAccount.id == id) {
                this.selectedAccount = nextAccount;
            }
        })

        this.modalRef.hide();
    }

    onAmountEntered(value: number){
        console.info("Entered = " + value);

        this.transactionAmount = value;

        this.modalRef.hide();
    }

    openModal(template: TemplateRef<any>, dialogClass: string) {
        this.modalRef = this.modalService.show(template, {class: dialogClass});
    }

    onCategorySelected(value: MoneyCategoryPickerSelectableOption) {
        this.selectedCategory = null;
        this.selectedXferAcc = null;

        if(value.accountTransfer != null) {
            this.selectedXferAcc = value.accountTransfer;
        } else {
            this.selectedCategory = value.category;
        }

        this.modalRef.hide();
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
