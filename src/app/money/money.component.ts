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

    static defaultFilter(): TransactionFilter {
        const f = new TransactionFilter();
        f.locked = false;
        f.predicted = false;
        f.maxPageSize = 300;
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
}
