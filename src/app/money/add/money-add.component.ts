import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {concatMap, from} from 'rxjs';
import {MoneyService} from '../money.service';
import {JbAccount} from '../account/jbAccount';
import {Category} from '../category/category';
import {Transaction} from '../transaction/transaction';

interface PendingTransaction {
    date: string;
    account: JbAccount;
    category: Category;
    description: string;
    amount: number;
    amountType: 'CR' | 'DB';
}

@Component({
    selector: 'jbr-money-add',
    templateUrl: './money-add.component.html',
    styleUrls: ['./money-add.component.css'],
    imports: [NgIf, NgForOf, NgClass, FormsModule, BsDatepickerModule],
    standalone: true
})
export class MoneyAddComponent implements OnInit {
    @Output() addClosed = new EventEmitter<void>();
    @Output() transactionAdded = new EventEmitter<void>();

    date: Date = new Date();
    selectedAccount: JbAccount = null;
    selectedCategory: Category = null;
    description = '';
    amount: number = null;
    amountType: 'CR' | 'DB' = 'DB';

    allAccounts: JbAccount[] = [];
    allCategories: Category[] = [];
    showCategories = false;

    pendingList: PendingTransaction[] = [];
    validationError: string = null;
    saving = false;

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

    accountBgColor(account: JbAccount): string {
        return this.selectedAccount?.id === account.id ? '#' + account.colour : '#1a1a2e';
    }

    accountFgColor(account: JbAccount): string {
        return this.selectedAccount?.id === account.id
            ? '#' + MoneyService.getTextColor(account.colour) : '#777';
    }

    accountBorderColor(account: JbAccount): string {
        return '#' + account.colour;
    }

    catBgColor(cat: Category): string {
        return this.selectedCategory?.id === cat.id ? '#' + cat.colour : '#1a1a2e';
    }

    catFgColor(cat: Category): string {
        return this.selectedCategory?.id === cat.id
            ? '#' + MoneyService.getTextColor(cat.colour) : '#777';
    }

    catBorderColor(cat: Category): string {
        return '#' + cat.colour;
    }

    amountTypeClass(type: 'CR' | 'DB'): string {
        if (this.amountType !== type) { return 'btn btn-sm btn-outline-secondary'; }
        return type === 'DB' ? 'btn btn-sm btn-danger' : 'btn btn-sm btn-success';
    }

    selectAccount(account: JbAccount): void {
        this.selectedAccount = account;
        this.validationError = null;
    }

    selectCategory(cat: Category): void {
        this.selectedCategory = cat;
        this.showCategories = false;
        this.validationError = null;
    }

    hasFormData(): boolean {
        return !!(this.description?.trim() || this.amount);
    }

    get saveAllLabel(): string {
        const n = this.pendingList.length;
        return n > 0 ? `Save All (${n})` : 'Save All';
    }

    private isFormValid(): boolean {
        if (!this.date) { this.validationError = 'Date is required.'; return false; }
        if (!this.selectedAccount) { this.validationError = 'Account is required.'; return false; }
        if (!this.selectedCategory) { this.validationError = 'Category is required.'; return false; }
        if (!this.description?.trim()) { this.validationError = 'Description is required.'; return false; }
        if (!this.amount || this.amount <= 0) { this.validationError = 'Amount must be greater than zero.'; return false; }
        this.validationError = null;
        return true;
    }

    private formToPending(): PendingTransaction {
        return {
            date: this.datePipe.transform(this.date, 'yyyy-MM-dd'),
            account: this.selectedAccount,
            category: this.selectedCategory,
            description: this.description.trim(),
            amount: this.amount,
            amountType: this.amountType
        };
    }

    private resetForm(): void {
        this.date = new Date();
        this.description = '';
        this.amount = null;
        this.amountType = 'DB';
        this.validationError = null;
        // Keep account and category for convenience when adding multiple transactions
    }

    private toTransaction(p: PendingTransaction): Transaction {
        const t = new Transaction();
        t.date = p.date;
        t.amount = p.amountType === 'DB' ? -p.amount : p.amount;
        t.description = p.description;
        t.accountId = p.account.id;
        t.categoryId = p.category.id;
        return t;
    }

    pendingAmountLabel(p: PendingTransaction): string {
        const sign = p.amountType === 'CR' ? '+' : '-';
        return `${sign}£${p.amount.toFixed(2)}`;
    }

    fmtDate(iso: string): string {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const parts = iso.split('-');
        return parts[2] + '-' + months[+parts[1] - 1] + '-' + parts[0];
    }

    onAdd(): void {
        if (!this.isFormValid()) { return; }
        this.pendingList.push(this.formToPending());
        this.resetForm();
    }

    onRemovePending(index: number): void {
        this.pendingList.splice(index, 1);
    }

    onSaveAll(): void {
        if (this.hasFormData()) {
            if (!this.isFormValid()) { return; }
            this.pendingList.push(this.formToPending());
            this.resetForm();
        }
        if (this.pendingList.length === 0) {
            this.validationError = 'Nothing to save — fill in the form or click Add first.';
            return;
        }
        this.saving = true;
        const list = [...this.pendingList];
        this.pendingList = [];
        from(list).pipe(
            concatMap(p => this.moneyService.addTransaction([this.toTransaction(p)]))
        ).subscribe({
            error: () => {
                this.saving = false;
                this.validationError = 'Save failed — check the log.';
            },
            complete: () => {
                this.saving = false;
                this.transactionAdded.emit();
                this.addClosed.emit();
            }
        });
    }

    onAddAndClose(): void {
        if (!this.isFormValid()) { return; }
        this.saving = true;
        this.moneyService.addTransaction([this.toTransaction(this.formToPending())]).subscribe({
            error: () => {
                this.saving = false;
                this.validationError = 'Save failed — check the log.';
            },
            complete: () => {
                this.saving = false;
                this.transactionAdded.emit();
                this.addClosed.emit();
            }
        });
    }

    @HostListener('document:keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.addClosed.emit();
        }
    }

    onClose(): void {
        this.addClosed.emit();
    }
}
