import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TransactionFilter} from '../transaction/transactionFilter';
import {MoneyService} from '../money.service';
import {formatCurrency, NgForOf, NgIf} from '@angular/common';
import {GridDataDate} from './data/grid-data-date';
import {GridDataAccount} from './data/grid-data-account';
import {GridDataAmount} from './data/grid-data-amount';
import {GridDataBalance} from './data/grid-data-balance';
import {GridDataCategory} from './data/grid-data-category';
import {GridDataDescription} from './data/grid-data-description';
import {GridDataFromReconciliation} from './data/grid-data-from-reconciliation';
import {GridDataPredicted} from './data/grid-data-predicted';
import {GridDataStatement} from './data/grid-data-statement';
import {GridDataStatementDate} from './data/grid-data-statement-date';
import {GridHeaderSelect, SelectChange} from './header/grid-header-select';
import {GridHeaderActions} from './header/grid-header-actions';
import {GridDataSelect} from './data/grid-data-select';
import {GridDataActions} from './data/grid-data-actions';
import {HeaderType} from './header/grid-header-type';
import {ITransactionReport, TransactionReport} from '../transaction/transactionReport';
import {JbAccount} from '../account/jbAccount';
import {FinancialAmount} from '../transaction/financialAmount';
import {TransactionEditType} from '../transaction/transactionEditType';
import {GridDataEvent} from './data/grid-data-event';
import {GridDataActionType} from './data/grid-data-action-type';
import {Transaction} from '../transaction/transaction';
import {IStatement} from '../statement/statement';
import {IFile} from '../files/file';
import {environment} from '../../../environments/environment.prod';

@Component({
    selector: 'jbr-grid-transaction',
    templateUrl: './grid-transaction.html',
    styleUrls: ['./grid-transaction.css'],
    imports: [
        NgForOf,
        NgIf,
        GridHeaderSelect,
        GridHeaderActions,
        GridDataDate,
        GridDataAccount,
        GridDataAmount,
        GridDataBalance,
        GridDataCategory,
        GridDataDescription,
        GridDataFromReconciliation,
        GridDataPredicted,
        GridDataStatement,
        GridDataStatementDate,
        GridDataSelect,
        GridDataActions
    ],
    standalone: true
})
export class GridTransaction implements OnInit, OnChanges {

    constructor(private readonly _moneyService: MoneyService) {
    }
    protected readonly HeaderType = HeaderType;
    @Input() filter: TransactionFilter;
    data: ITransactionReport[] = null;
    newTransaction: TransactionReport = new TransactionReport();
    status = 'ready';
    version = '';
    @Output() hasChanges = new EventEmitter<boolean>();
    @Output() statusChange: EventEmitter<string> = new EventEmitter();
    @Output() versionChange: EventEmitter<string> = new EventEmitter();

    static clearTransaction(transaction: ITransactionReport, filter: TransactionFilter) {
        transaction.new = true;
        transaction.type = TransactionReport.TRANSACTION;
        transaction.date ??= MoneyService.getDateString(new Date());
        transaction.description = '';
        transaction.account = JbAccount.unknownAccount();
        transaction.fromReconciliation = false;
        transaction.predicted = false;
        transaction.amount = new FinancialAmount(0, 'CR');
        transaction.balance = new FinancialAmount(0, 'CR');
        transaction.selectable = false;

        // If the filter is a single account, then use that.
        if (filter.accounts?.length === 1) {
            transaction.account = filter.accounts[0];
        }

        // If the filter is a single category, then use that.
        if (filter.categories?.length === 1) {
            transaction.category = filter.categories[0];
        } else {
            transaction.category = null;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['filter'] && !changes['filter'].firstChange) {
            this.update();
        }
    }

    ngOnInit(): void {
        this._moneyService.getVersion().subscribe({
            next: value => { this.version = '(v' + value.version + ')'; this.versionChange.emit(this.version); },
            error: (response) => {
                console.error('❌ getVersion failed:', response);
            },
            complete: () => console.log('🔑 Got Version'),
        });

        this.update();
    }

    headerFiltered(header: HeaderType): boolean {
        // Determine if the header is filtered based on the filter.
        switch (header) {
            case HeaderType.Account:
                return !(this.filter.accounts == null || this.filter.accounts.length === 0);

            case HeaderType.Locked:
                return this.filter.locked != null;

            case HeaderType.Predicted:
                return this.filter.predicted != null;

            case HeaderType.Reconciliation:
                return this.filter.fromReconciled != null;

            case HeaderType.Category:
                return !(this.filter.categories == null || this.filter.categories.length === 0);

            case HeaderType.StatementDate:
                return this.filter.statementDate != null || this.filter.statementAge != null;

            case HeaderType.Date:
                return this.filter.dateRange != null;

            case HeaderType.Description:
                return this.filter.description != null;

            case HeaderType.Credit:
            case HeaderType.Debit:
                return this.filter.valueRange != null;
        }

        // Default - not filtered
        return false;
    }

    filterTooltip(header: HeaderType): string {
        if (!this.filter) { return ''; }

        switch (header) {
            case HeaderType.Date:
                if (this.filter.dateRange) {
                    return this.fmtDate(this.filter.dateRange.from) + ' → ' + this.fmtDate(this.filter.dateRange.to);
                }
                break;

            case HeaderType.Account:
                if (this.filter.accounts?.length > 0) {
                    return this.filter.accounts.length <= 3
                        ? this.filter.accounts.map(a => a.name).join(', ')
                        : this.filter.accounts.length + ' accounts selected';
                }
                break;

            case HeaderType.StatementDate:
                if (this.filter.statementDate != null && !this.filter.statementDate.none) {
                    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                    return months[this.filter.statementDate.month - 1] + ' ' + this.filter.statementDate.year;
                }
                if (this.filter.statementAge != null) {
                    return this.filter.statementAge === 0
                        ? 'Most recent statement'
                        : this.filter.statementAge + ' statements back';
                }
                break;

            case HeaderType.Locked:
                if (this.filter.locked != null) {
                    return 'Locked: ' + (this.filter.locked ? 'Yes' : 'No');
                }
                break;

            case HeaderType.Predicted:
                if (this.filter.predicted != null) {
                    return 'Predicted: ' + (this.filter.predicted ? 'Yes' : 'No');
                }
                break;

            case HeaderType.Reconciliation:
                if (this.filter.fromReconciled != null) {
                    return 'Reconciled: ' + (this.filter.fromReconciled ? 'Yes' : 'No');
                }
                break;

            case HeaderType.Category:
                if (this.filter.categories?.length > 0) {
                    return this.filter.categories.length <= 3
                        ? this.filter.categories.map(c => c.name).join(', ')
                        : this.filter.categories.length + ' categories selected';
                }
                break;

            case HeaderType.Description:
                if (this.filter.description) {
                    return 'Contains: "' + this.filter.description + '"';
                }
                break;

            case HeaderType.Credit:
            case HeaderType.Debit:
                if (this.filter.valueRange) {
                    return formatCurrency(this.filter.valueRange.minimum, 'en-UK', '£', 'GBP', '1.2-2')
                        + ' → '
                        + formatCurrency(this.filter.valueRange.maximum, 'en-UK', '£', 'GBP', '1.2-2');
                }
                break;
        }

        return '';
    }

    private fmtDate(iso: string): string {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const p = iso.split('-');
        return p[2] + '-' + months[+p[1] - 1] + '-' + p[0];
    }

    selectionChange(event: SelectChange) {
        this.data.forEach(value => {
            if (value.type === TransactionReport.TRANSACTION) {
                value.selected = event.selection;
            }
        });
    }

    update() {
        this.status = 'Updating transactions ...';
        this.statusChange.emit(this.status);
        this.data = [];
        this._moneyService.getTransactions(this.filter).subscribe({
            next: (val) => {
                this.data = val;

                // Create a placeholder for the new transaction.
                GridTransaction.clearTransaction(this.newTransaction, this.filter);
                this.data.unshift(this.newTransaction);
            },
            error: (response) => {
                this.status = 'Update failed ' + response;
                console.error('❌ getTransactions failed:', response);
            },
            complete: () => {
                // Mark the rows that are selectable.
                let credits = 0;
                let debits = 0;
                this.data.forEach(value => {
                    value.modified = false;
                    if (value.type === TransactionReport.TRANSACTION) {
                        value.selectable = !value.new;

                        if (!value.new) {
                            if (value.amount.type === 'DB') {
                                debits -= value.amount.value;
                            } else {
                                credits += value.amount.value;
                            }
                        }
                    } else {
                        value.selectable = false;
                    }
                });
                this.status = this.data.length +
                    ' transactions displayed. Debits: ' +
                    formatCurrency(debits, 'en-UK', '£', 'GBP', '1.2-2') +
                    ', Credits: ' + formatCurrency(credits, 'en-UK', '£', 'GBP', '1.2-2');
                this.statusChange.emit(this.status);
                this.hasChanges.emit(false);
                console.log('✅ getTransactions complete:', this.status);
            }
        });
    }

    onEdit() {
        this.data.forEach(value => {
            value.editing = TransactionEditType.None;
        });
    }

    private computeHasChanges(): boolean {
        return this.data?.some(t => t.modified) ?? false;
    }

    save() {
        const modifiedExisting = this.data.filter(t => t.modified && !t.new);
        const newTrn = this.data.find(t => t.new && t.modified);

        if (modifiedExisting.length > 0) {
            this.performActionUpdate(modifiedExisting);
        }

        if (newTrn != null && this.isValidNewTransaction(newTrn)) {
            this.performActionAdd(newTrn);
        }
    }

    private isValidNewTransaction(t: ITransactionReport): boolean {
        return t.date != null &&
            t.account != null &&
            t.account.id !== JbAccount.unknownAccountId &&
            t.category != null &&
            t.description != null &&
            t.description.length > 0 &&
            t.amount.value !== 0;
    }

    valueChanged(event: GridDataEvent) {
        // If this is a category change from a selected row, then apply to the other selected rows.
        if (event.source === HeaderType.Category && event.transaction.selected && !event.transaction.category.systemUse) {
            this.data.forEach(next => {
                if (next.selected &&  next.id !== event.transaction.id) {
                    next.category = event.transaction.category;
                    next.modified = true;
                }
            });
        }

        this.hasChanges.emit(this.computeHasChanges());
    }

    performActionUpdate(transactions: ITransactionReport[]) {
        this._moneyService.updateTransaction(transactions).subscribe({
            next: (val) => {
                console.log('✅ Updated TRN:', val.date, val.amount, val.error);
            },
            error: (response) => {
                console.error('❌ Failed to update TRN:', response);
            },
            complete: () => {
                this.update();
            }
        });
    }

    performActionAdd(transaction: ITransactionReport) {
        // Create the new transaction (if transfer then its two).
        const transactions: Transaction[] = [];

        let newTransaction: Transaction = new Transaction();
        transactions.push(newTransaction);
        newTransaction.date = transaction.date;
        newTransaction.amount = transaction.amount.value;
        newTransaction.description = transaction.description;
        newTransaction.accountId = transaction.account.id;

        if (transaction.category.id === 'TRF') {
            // This is a transfer.
            newTransaction.categoryId = transaction.category.id;

            newTransaction = new Transaction();
            transactions.push(newTransaction);
            newTransaction.date = transaction.date;
            newTransaction.amount = transaction.amount.value;
            newTransaction.description = transaction.description;
            newTransaction.accountId = transaction.transferAccountId;
        } else {
            // Standard transaction.
            newTransaction.categoryId = transaction.category.id;
        }

        this._moneyService.addTransaction(transactions).subscribe({
            next: (val) => {
                console.log('➕ Created TRN:', val.date, val.amount);
            },
            error: (response) => {
                console.error('❌ Failed to add TRN:', response);
            },
            complete: () => {
                this.update();
            }
        });
    }

    performActionReconcile(transactions: ITransactionReport[]) {
        this._moneyService.reconcile(transactions, true).subscribe({
            error: (response) => {
                console.error('❌ Failed to reconcile TRN:', response);
            },
            complete: () => {
                this.update();
            }
        });
    }

    performActionUnreconcile(transactions: ITransactionReport[]) {
        this._moneyService.reconcile(transactions, false).subscribe({
            error: (response) => {
                console.error('❌ Failed to reconcile TRN:', response);
            },
            complete: () => {
                this.update();
            }
        });
    }

    performActionDelete(transactions: ITransactionReport[]) {
        // Delete this transaction.
        this._moneyService.deleteTransaction(transactions).subscribe({
            error: (response) => {
                console.error('❌ Failed to delete TRN:', response);
            },
            complete: () => {
                this.update();
            }
        });
    }

    performActionClearAdd(transaction: ITransactionReport) {
        GridTransaction.clearTransaction(transaction, this.filter);
        transaction.modified = false;
        this.hasChanges.emit(this.computeHasChanges());
    }

    performAction(event: GridDataEvent) {
        // If multiple transactions are selected, then they should all be processed together.
        const transactions: ITransactionReport[] = [];

        if (event.transaction.selected) {
            // Pass all selected modified transactions
            this.data.forEach(next => {
                if (event.action === GridDataActionType.Update) {
                    if (next.selected && next.modified) {
                        transactions.push(next);
                    }
                } else if (next.selected) {
                    transactions.push(next);
                }
            });
        } else {
            transactions.push(event.transaction);
        }

        // Perform the action specified.
        switch (event.action) {
            case GridDataActionType.Update:
                this.performActionUpdate(transactions);
                break;
            case GridDataActionType.Reconcile:
                this.performActionReconcile(transactions);
                break;
            case GridDataActionType.Unreconcile:
                this.performActionUnreconcile(transactions);
                break;
            case GridDataActionType.Delete:
                this.performActionDelete(transactions);
                break;
            case GridDataActionType.ClearAdd:
                this.performActionClearAdd(event.transaction);
                break;
            case GridDataActionType.Add:
                this.performActionAdd(event.transaction);
                break;
            case GridDataActionType.PendingUpdate:
            case GridDataActionType.PendingAdd:
                console.log('⏭️ Pending action ignored:', event.action);
                break;
        }
    }

    lockStatement(statement: IStatement) {
        console.log('🔒 Lock Statement');
        this._moneyService.lockStatement(statement).subscribe({
            error: (response) => {
                console.error('❌ Failed to lock statement:', response);
            },
            complete: () => {
                this.update();
            }
        });
    }

    clearRecData() {
        console.log('🧹 Clear reconciliation data file');

        this._moneyService.clearRecData().subscribe({
            error: (response) => {
                console.error('❌ Failed to clear rec data:', response);
            },
            complete: () => {
                this.update();
            }
        });
    }

    selectRecData(file: IFile) {
        console.log('📂 Load file:', file.filename);

        this._moneyService.loadFileRequest(file).subscribe({
            error: (response) => {
                if (environment.production) {
                    console.error('❌ Failed to load file:', response);
                } else {
                    // Treat as complete.
                    this.update();
                }
            },
            complete: () => {
                this.update();
            }
        });
    }
}
