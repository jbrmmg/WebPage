import {Component, HostListener, ViewChild} from '@angular/core';
import {TransactionFilter} from './transaction/transactionFilter';
import {GridTransaction} from './grid/grid-transaction';

@Component({
    templateUrl: './money.component.html',
    styleUrls: ['./money.component.css']
})
export class MoneyComponent {
    @ViewChild(GridTransaction) private grid: GridTransaction;

    status = '';
    version = '';
    showFilter = false;
    showAdd = false;
    showTransfer = false;
    hasChanges = false;
    filter: TransactionFilter = MoneyComponent.defaultFilter();
    totalCount = 0;
    totalPages = 1;

    get currentPage(): number { return this.filter.pageNumber; }

    static defaultFilter(): TransactionFilter {
        const f = new TransactionFilter();
        f.locked = false;
        f.predicted = false;
        f.maxPageSize = 300;
        f.pageNumber = 1;
        f.accounts = [];
        f.categories = [];
        return f;
    }

    @HostListener('document:keydown.f3', ['$event'])
    onF3(event: KeyboardEvent): void {
        event.preventDefault();
        this.showFilter = !this.showFilter;
    }

    onFilterApplied(newFilter: TransactionFilter): void {
        newFilter.pageNumber = 1;
        this.filter = newFilter;
        this.showFilter = false;
    }

    onSave(): void {
        this.grid.save();
    }

    onLoadRecFile(): void {
        this.grid.openRecFileModal();
    }

    onFilterChange(filter: TransactionFilter): void {
        this.filter = filter;
    }

    onTransactionAdded(): void {
        this.grid.update();
    }

    onTotalCountChange(totalCount: number): void {
        this.totalCount = totalCount;
        this.totalPages = Math.ceil(totalCount / this.filter.maxPageSize) || 1;
    }

    onPrev(): void {
        if (this.filter.pageNumber > 1) {
            this.filter = { ...this.filter, pageNumber: this.filter.pageNumber - 1 };
        }
    }

    onNext(): void {
        if (this.filter.pageNumber < this.totalPages) {
            this.filter = { ...this.filter, pageNumber: this.filter.pageNumber + 1 };
        }
    }

    onPageSizeChange(pageSize: number): void {
        this.filter = { ...this.filter, maxPageSize: pageSize, pageNumber: 1 };
    }
}
