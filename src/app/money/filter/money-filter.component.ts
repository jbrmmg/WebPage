import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {TransactionFilter} from '../transaction/transactionFilter';
import {MoneyService} from '../money.service';
import {Category} from '../category/category';
import {JbAccount} from '../account/jbAccount';
import {DateRange} from '../range/dateRange';
import {StatementDate} from '../statement/statementDate';
import {ValueRange} from '../range/valueRange';

type Tristate = boolean | null;

@Component({
    selector: 'jbr-money-filter',
    templateUrl: './money-filter.component.html',
    styleUrls: ['./money-filter.component.css'],
    imports: [NgIf, NgForOf, NgClass, FormsModule, BsDatepickerModule],
    standalone: true
})
export class MoneyFilterComponent implements OnInit {
    @Input() filter: TransactionFilter;
    @Output() filterApplied = new EventEmitter<TransactionFilter>();
    @Output() filterClosed = new EventEmitter<void>();

    locked: Tristate = false;
    changed: Tristate = null;
    predicted: Tristate = false;
    reconciled: Tristate = null;

    dateMode: 'none' | 'statement' | 'range' = 'none';
    statementMode: 'monthyear' | 'index' = 'monthyear';
    statementYear: number = null;
    statementMonth: number = null;
    statementIndex: number = null;
    dateFrom: Date = new Date();
    dateTo: Date = new Date();

    readonly statementYears: number[];
    readonly monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    description = '';
    amountFrom: number = null;
    amountTo: number = null;

    allAccounts: JbAccount[] = [];
    selectedAccountIds = new Set<string>();

    allCategories: Category[] = [];
    selectedCategoryIds = new Set<string>();
    showCategories = false;

    validationError: string = null;

    private readonly datePipe = new DatePipe('en-UK');

    constructor(private readonly _moneyService: MoneyService) {
        const y = new Date().getFullYear();
        this.statementYears = Array.from({length: 6}, (_, i) => y - i);
    }

    ngOnInit(): void {
        this._moneyService.getCategories().subscribe({
            next: cats => { this.allCategories = cats; }
        });

        this._moneyService.getAccounts().subscribe({
            next: accounts => { this.allAccounts = accounts.filter(a => !a.closed); }
        });

        if (!this.filter) { return; }

        this.locked = this.filter.locked ?? false;
        this.changed = this.filter.changed ?? null;
        this.predicted = this.filter.predicted ?? false;
        this.reconciled = this.filter.fromReconciled ?? null;

        if (this.filter.statementDate != null && !this.filter.statementDate.none) {
            this.dateMode = 'statement';
            this.statementMode = 'monthyear';
            this.statementYear = this.filter.statementDate.year;
            this.statementMonth = this.filter.statementDate.month;
        } else if (this.filter.statementAge != null) {
            this.dateMode = 'statement';
            this.statementMode = 'index';
            this.statementIndex = this.filter.statementAge;
        } else if (this.filter.dateRange != null) {
            this.dateMode = 'range';
            this.dateFrom = new Date(this.filter.dateRange.from + 'T00:00:00');
            this.dateTo = new Date(this.filter.dateRange.to + 'T00:00:00');
        }

        this.description = this.filter.description ?? '';

        if (this.filter.valueRange != null) {
            this.amountFrom = this.filter.valueRange.minimum;
            this.amountTo = this.filter.valueRange.maximum;
        }

        this.filter.categories?.forEach(c => this.selectedCategoryIds.add(c.id));
        this.filter.accounts?.forEach(a => this.selectedAccountIds.add(a.id));
    }

    get dateDisabled(): boolean {
        return this.predicted === true;
    }

    get reconcileRequiresOneAccount(): boolean {
        return this.reconciled === true;
    }

    setReconciled(value: Tristate): void {
        this.reconciled = value;
        this.validationError = null;
        // Reconciled=true requires exactly one account — clear multi-selection so user re-picks
        if (value === true && this.selectedAccountIds.size > 1) {
            this.selectedAccountIds.clear();
        }
    }

    toggleAccount(account: JbAccount): void {
        if (this.reconcileRequiresOneAccount) {
            // Radio-button behaviour: exactly one account at a time
            this.selectedAccountIds.clear();
            this.selectedAccountIds.add(account.id);
        } else {
            if (this.selectedAccountIds.has(account.id)) {
                this.selectedAccountIds.delete(account.id);
            } else {
                this.selectedAccountIds.add(account.id);
            }
        }
        this.validationError = null;
    }

    clearAccounts(): void {
        this.selectedAccountIds.clear();
        this.validationError = null;
    }

    accountFilterSummary(): string {
        if (this.selectedAccountIds.size === 0) { return '(all)'; }
        return `(${this.selectedAccountIds.size} selected)`;
    }

    accountBgColor(account: JbAccount): string {
        return this.selectedAccountIds.size === 0 || this.selectedAccountIds.has(account.id)
            ? '#' + account.colour : '#1a1a2e';
    }

    accountFgColor(account: JbAccount): string {
        if (this.selectedAccountIds.size === 0 || this.selectedAccountIds.has(account.id)) {
            return '#' + MoneyService.getTextColor(account.colour);
        }
        return '#555';
    }

    accountBorderColor(account: JbAccount): string {
        return '#' + account.colour;
    }

    setDateMode(mode: 'none' | 'statement' | 'range'): void {
        if (this.dateDisabled && mode !== 'none') { return; }
        this.dateMode = mode;
    }

    tristateClass(current: Tristate, value: Tristate): string {
        return current === value
            ? 'btn btn-sm btn-success tristate-btn'
            : 'btn btn-sm btn-outline-secondary tristate-btn';
    }

    toggleCategory(cat: Category): void {
        if (this.selectedCategoryIds.has(cat.id)) {
            this.selectedCategoryIds.delete(cat.id);
        } else {
            this.selectedCategoryIds.add(cat.id);
        }
    }

    selectAllCategories(): void {
        this.selectedCategoryIds.clear();
    }

    categoryFilterSummary(): string {
        return this.selectedCategoryIds.size === 0 ? '(all)' : `(${this.selectedCategoryIds.size} selected)`;
    }

    catBgColor(cat: Category): string {
        return this.selectedCategoryIds.size === 0 || this.selectedCategoryIds.has(cat.id)
            ? '#' + cat.colour : '#1a1a2e';
    }

    catFgColor(cat: Category): string {
        if (this.selectedCategoryIds.size === 0 || this.selectedCategoryIds.has(cat.id)) {
            return '#' + MoneyService.getTextColor(cat.colour);
        }
        return '#555';
    }

    catBorderColor(cat: Category): string {
        return '#' + cat.colour;
    }

    setYearToDate(): void {
        const t = new Date();
        this.dateFrom = new Date(t.getFullYear(), 0, 1);
        this.dateTo = t;
    }

    setLastYear(): void {
        const t = new Date();
        this.dateFrom = new Date(t.getFullYear() - 1, 0, 1);
        this.dateTo = new Date(t.getFullYear() - 1, 11, 31);
    }

    setMonthToDate(): void {
        const t = new Date();
        this.dateFrom = new Date(t.getFullYear(), t.getMonth(), 1);
        this.dateTo = t;
    }

    setLastMonth(): void {
        const t = new Date();
        const m = t.getMonth() === 0 ? 11 : t.getMonth() - 1;
        const y = t.getMonth() === 0 ? t.getFullYear() - 1 : t.getFullYear();
        this.dateFrom = new Date(y, m, t.getDate());
        this.dateTo = t;
    }

    setPreviousMonth(): void {
        const t = new Date();
        const m = t.getMonth() === 0 ? 11 : t.getMonth() - 1;
        const y = t.getMonth() === 0 ? t.getFullYear() - 1 : t.getFullYear();
        this.dateFrom = new Date(y, m, 1);
        this.dateTo = new Date(t.getFullYear(), t.getMonth(), 0);
    }

    @HostListener('document:keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.onExit();
        } else if (event.key === 'F4') {
            event.preventDefault();
            this.onClear();
        } else if (event.key === 'Enter' && document.activeElement?.tagName !== 'BUTTON') {
            event.preventDefault();
            this.onOK();
        }
    }

    onOK(): void {
        if (this.reconciled === true && this.selectedAccountIds.size !== 1) {
            this.validationError = 'Reconciled filter requires exactly one account to be selected.';
            return;
        }

        this.validationError = null;
        const f = new TransactionFilter();
        f.maxPageSize = this.filter?.maxPageSize ?? 300;
        f.accounts = this.selectedAccountIds.size > 0
            ? this.allAccounts.filter(a => this.selectedAccountIds.has(a.id))
            : [];
        f.locked = this.locked;
        f.changed = this.changed;
        f.predicted = this.predicted;
        f.fromReconciled = this.reconciled;
        f.description = this.description.trim() || null;
        f.categories = [];

        if (this.amountFrom != null || this.amountTo != null) {
            f.valueRange = new ValueRange(this.amountFrom ?? 0, this.amountTo ?? 999999999);
        }

        if (!this.dateDisabled) {
            if (this.dateMode === 'statement') {
                if (this.statementMode === 'monthyear' && this.statementYear && this.statementMonth) {
                    f.statementDate = new StatementDate(this.statementYear, this.statementMonth);
                } else if (this.statementMode === 'index' && this.statementIndex != null) {
                    f.statementAge = this.statementIndex;
                }
            } else if (this.dateMode === 'range') {
                f.dateRange = new DateRange(
                    this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd'),
                    this.datePipe.transform(this.dateTo, 'yyyy-MM-dd')
                );
            }
        }

        if (this.selectedCategoryIds.size > 0) {
            f.categories = this.allCategories.filter(c => this.selectedCategoryIds.has(c.id));
        }

        this.filterApplied.emit(f);
    }

    onClear(): void {
        const f = new TransactionFilter();
        f.locked = false;
        f.predicted = false;
        f.maxPageSize = this.filter?.maxPageSize ?? 300;
        f.accounts = [];
        f.categories = [];
        this.validationError = null;
        this.filterApplied.emit(f);
    }

    onExit(): void {
        this.filterClosed.emit();
    }
}
