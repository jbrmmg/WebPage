import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {MoneyService} from '../money.service';
import {JbAccount} from '../account/jbAccount';
import {Transaction} from '../transaction/transaction';

@Component({
    selector: 'jbr-money-transfer',
    templateUrl: './money-transfer.component.html',
    styleUrls: ['./money-transfer.component.css'],
    imports: [NgIf, NgForOf, FormsModule, BsDatepickerModule],
    standalone: true
})
export class MoneyTransferComponent implements OnInit {
    @Output() transferClosed = new EventEmitter<void>();
    @Output() transactionAdded = new EventEmitter<void>();

    date: Date = new Date();
    fromAccount: JbAccount = null;
    toAccount: JbAccount = null;
    amount: number = null;
    description = 'Transfer';

    allAccounts: JbAccount[] = [];
    validationError: string = null;
    saving = false;

    private readonly datePipe = new DatePipe('en-UK');

    constructor(private readonly moneyService: MoneyService) {}

    ngOnInit(): void {
        this.moneyService.getAccounts().subscribe({
            next: accounts => {
                this.allAccounts = accounts.filter(a => !a.closed);
                const fd = this.allAccounts.find(a => a.name.toLowerCase().includes('bank'));
                if (fd) { this.fromAccount = fd; }
            }
        });
    }

    accountBgColor(account: JbAccount, selected: JbAccount): string {
        return selected?.id === account.id ? '#' + account.colour : '#1a1a2e';
    }

    accountFgColor(account: JbAccount, selected: JbAccount): string {
        return selected?.id === account.id
            ? '#' + MoneyService.getTextColor(account.colour) : '#777';
    }

    accountBorderColor(account: JbAccount): string {
        return '#' + account.colour;
    }

    private isValid(): boolean {
        if (!this.date) { this.validationError = 'Date is required.'; return false; }
        if (!this.fromAccount) { this.validationError = 'From account is required.'; return false; }
        if (!this.toAccount) { this.validationError = 'To account is required.'; return false; }
        if (this.fromAccount.id === this.toAccount.id) {
            this.validationError = 'From and To accounts must be different.'; return false;
        }
        if (!this.description?.trim()) { this.validationError = 'Description is required.'; return false; }
        if (!this.amount || this.amount <= 0) { this.validationError = 'Amount must be greater than zero.'; return false; }
        this.validationError = null;
        return true;
    }

    private buildTransactions(): Transaction[] {
        const dateStr = this.datePipe.transform(this.date, 'yyyy-MM-dd');
        const desc = this.description.trim();

        const from = new Transaction();
        from.date = dateStr;
        from.amount = -this.amount;
        from.accountId = this.fromAccount.id;
        from.categoryId = MoneyService.transferCategory();
        from.description = desc;

        const to = new Transaction();
        to.date = dateStr;
        to.amount = this.amount;
        to.accountId = this.toAccount.id;
        to.description = desc;

        return [from, to];
    }

    onSave(): void {
        if (!this.isValid()) { return; }
        this.saving = true;
        this.moneyService.addTransaction(this.buildTransactions()).subscribe({
            error: () => {
                this.saving = false;
                this.validationError = 'Save failed — check the log.';
            },
            complete: () => {
                this.saving = false;
                this.transactionAdded.emit();
                this.transferClosed.emit();
            }
        });
    }

    @HostListener('document:keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape') { this.transferClosed.emit(); }
    }

    onClose(): void {
        this.transferClosed.emit();
    }
}
