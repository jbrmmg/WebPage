import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf, DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {MoneyService} from '../money.service';
import {JbAccount} from '../account/jbAccount';
import {Category} from '../category/category';
import {Transaction} from '../transaction/transaction';

@Component({
    selector: 'jbr-mobile-add',
    templateUrl: './mobile-add.component.html',
    styleUrls: ['./mobile-add.component.css'],
    imports: [NgIf, NgForOf, NgClass, FormsModule, BsDatepickerModule, RouterLink],
    standalone: true
})
export class MobileAddComponent implements OnInit {
    date: Date = new Date();
    selectedAccount: JbAccount = null;
    selectedCategory: Category = null;
    description = '';
    amount: number = null;
    amountType: 'CR' | 'DB' = 'DB';

    allAccounts: JbAccount[] = [];
    allCategories: Category[] = [];
    validationError: string = null;
    saving = false;
    saveSuccess = false;

    private readonly datePipe = new DatePipe('en-UK');

    constructor(private readonly moneyService: MoneyService) {}

    ngOnInit(): void {
        this.moneyService.getAccounts().subscribe({
            next: accounts => { this.allAccounts = accounts.filter(a => !a.closed); }
        });
        this.moneyService.getCategories().subscribe({
            next: cats => { this.allCategories = cats.filter(c => !c.systemUse); }
        });
    }

    accountImageUrl(acc: JbAccount): string {
        return this.selectedAccount?.id === acc.id
            ? MoneyService.getAccountImage(acc.id)
            : MoneyService.getDisabledAccountImage(acc.id);
    }

    accountSelected(acc: JbAccount): boolean {
        return this.selectedAccount?.id === acc.id;
    }

    accountBorderColor(acc: JbAccount): string {
        return '#' + acc.colour;
    }

    catChipBg(cat: Category): string {
        return this.selectedCategory?.id === cat.id ? '#' + cat.colour : '#1a1a2e';
    }

    catChipFg(cat: Category): string {
        return this.selectedCategory?.id === cat.id
            ? '#' + MoneyService.getTextColor(cat.colour) : '#777';
    }

    catChipBorder(cat: Category): string {
        return '#' + cat.colour;
    }

    amountTypeClass(type: 'CR' | 'DB'): string {
        if (this.amountType !== type) { return 'btn btn-outline-secondary mobile-type-btn'; }
        return type === 'DB' ? 'btn btn-danger mobile-type-btn' : 'btn btn-success mobile-type-btn';
    }

    private isFormValid(): boolean {
        if (!this.date)                      { this.validationError = 'Date is required.'; return false; }
        if (!this.selectedAccount)           { this.validationError = 'Account is required.'; return false; }
        if (!this.selectedCategory)          { this.validationError = 'Category is required.'; return false; }
        if (!this.description?.trim())       { this.validationError = 'Description is required.'; return false; }
        if (!this.amount || this.amount <= 0){ this.validationError = 'Amount must be greater than zero.'; return false; }
        this.validationError = null;
        return true;
    }

    private toTransaction(): Transaction {
        const t = new Transaction();
        t.date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
        t.amount = this.amountType === 'DB' ? -this.amount : this.amount;
        t.description = this.description.trim();
        t.accountId = this.selectedAccount.id;
        t.categoryId = this.selectedCategory.id;
        return t;
    }

    private resetForm(): void {
        this.date = new Date();
        this.description = '';
        this.amount = null;
        this.amountType = 'DB';
        this.validationError = null;
    }

    onSave(): void {
        if (!this.isFormValid()) { return; }
        this.saving = true;
        this.moneyService.addTransaction([this.toTransaction()]).subscribe({
            error: () => {
                this.saving = false;
                this.validationError = 'Save failed — check the log.';
            },
            complete: () => {
                this.saving = false;
                this.saveSuccess = true;
                this.resetForm();
                setTimeout(() => { this.saveSuccess = false; }, 3000);
            }
        });
    }
}
