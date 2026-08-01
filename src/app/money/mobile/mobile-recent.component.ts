import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MoneyService} from '../money.service';
import {TransactionFilter} from '../transaction/transactionFilter';
import {ITransactionReport} from '../transaction/transactionReport';
import {IFinancialAmount} from '../transaction/financialAmount';

const PAGE_SIZE = 20;

@Component({
    selector: 'jbr-mobile-recent',
    templateUrl: './mobile-recent.component.html',
    styleUrls: ['./mobile-recent.component.css'],
    imports: [NgIf, NgForOf, NgClass, RouterLink],
    standalone: true
})
export class MobileRecentComponent implements OnInit {
    transactions: ITransactionReport[] = [];
    currentPage = 1;
    totalPages = 1;
    loading = false;
    error: string = null;

    constructor(private readonly moneyService: MoneyService) {}

    ngOnInit(): void {
        this.fetch();
    }

    private buildFilter(): TransactionFilter {
        const f = new TransactionFilter();
        f.locked = false;
        f.predicted = false;
        f.maxPageSize = PAGE_SIZE;
        f.pageNumber = this.currentPage;
        f.accounts = [];
        f.categories = [];
        return f;
    }

    fetch(): void {
        this.loading = true;
        this.error = null;
        this.moneyService.getTransactions(this.buildFilter()).subscribe({
            next: page => {
                this.transactions = page.transactions.filter(t => t.type === 'TRANSACTION');
                this.totalPages = Math.ceil(page.totalCount / PAGE_SIZE) || 1;
                this.loading = false;
            },
            error: () => {
                this.error = 'Failed to load transactions.';
                this.loading = false;
            }
        });
    }

    onPrev(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.fetch();
        }
    }

    onNext(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.fetch();
        }
    }

    formatDate(iso: string): string {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const [y, m, d] = iso.split('-');
        return `${d}-${months[+m - 1]}-${y}`;
    }

    formatAmount(amount: IFinancialAmount): string {
        const sign = amount.type === 'CR' ? '+' : '-';
        return `${sign}£${Math.abs(amount.value).toFixed(2)}`;
    }

    isCredit(amount: IFinancialAmount): boolean {
        return amount.type === 'CR';
    }

    catTextColor(colour: string): string {
        return '#' + MoneyService.getTextColor(colour);
    }
}
