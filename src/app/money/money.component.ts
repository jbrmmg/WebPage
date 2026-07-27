import {Component} from '@angular/core';
import {TransactionFilter} from './transaction/transactionFilter';

@Component({
    templateUrl: './money.component.html',
    styleUrls: ['./money.component.css']
})
export class MoneyComponent {
    status = '';
    version = '';
    showFilter = false;
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

    onFilterApplied(newFilter: TransactionFilter): void {
        this.filter = newFilter;
        this.showFilter = false;
    }
}
