import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TransactionFilter} from '../transaction/transactionFilter';
import {MoneyService} from '../money.service';
import {FlagType} from './header/grid-header-flag-type';
import {formatCurrency, NgForOf, NgIf} from '@angular/common';
import {GridHeaderDate} from './header/grid-header-date';
import {GridDataDate} from './data/grid-data-date';
import {GridHeaderAccount} from './header/grid-header-account';
import {GridHeaderAmount} from './header/grid-header-amount';
import {GridHeaderCategory} from './header/grid-header-category';
import {GridHeaderFlag} from './header/grid-header-flag';
import {GridHeaderStatementDate} from './header/grid-header-statement-date';
import {GridHeaderText} from './header/grid-header-text';
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
import {FilterEvent} from './header/grid-header';
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
        GridHeaderDate,
        GridHeaderAccount,
        GridHeaderAmount,
        GridHeaderCategory,
        GridHeaderFlag,
        GridHeaderStatementDate,
        GridHeaderText,
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
export class GridTransaction implements OnInit {

    constructor(private _moneyService: MoneyService) {
    }
    protected readonly FlagType = FlagType;
    protected readonly HeaderType = HeaderType;
    data: ITransactionReport[] = null;
    filter: TransactionFilter = new TransactionFilter();
    newTransaction: TransactionReport = new TransactionReport();
    status = 'ready';
    version = '';
    @Output() gridDataChangeHandler: EventEmitter<any> = new EventEmitter();

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
        if (filter.accounts.length === 1) {
            transaction.account = filter.accounts[0];
        }

        // If the filter is a single category, then use that.
        if (filter.categories.length === 1) {
            transaction.category = filter.categories[0];
        } else {
            transaction.category = null;
        }
    }

    ngOnInit(): void {
        this.filter.predicted = false;
        this.filter.locked = false;
        this.filter.maxPageSize = 300;

        this._moneyService.getVersion().subscribe({
            next: value => this.version = '(v' + value.version + ')',
            error: (response) => {
                console.error('getVersion Failed ' + response);
            },
            complete: () => console.log('Got Version'),
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
                return this.filter.statementDate != null;

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

    filterChange(event: FilterEvent) {
        console.log('Update from ' + event.source);

        // Update the transactions.
        this.update();
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
                console.error('getTransactions Failed ' + response);
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
                console.log('getTransactions Complete. ' + this.status);
            }
        });
    }

    onEdit() {
        this.data.forEach(value => {
            value.editing = TransactionEditType.None;
        });
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

        this.gridDataChangeHandler.emit(event);
    }

    performActionUpdate(transactions: ITransactionReport[]) {
        this._moneyService.updateTransaction(transactions).subscribe({
            next: (val) => {
                console.log('Updated TRN: ' + val.date + ' ' + val.amount + ' ' + val.error);
            },
            error: (response) => {
                console.log('Failed to update TRN: ' + response);
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
                console.log('Created TRN: ' + val.date + ' ' + val.amount);
            },
            error: (response) => {
                console.log('Failed to add TRN: ' + response);
            },
            complete: () => {
                this.update();
            }
        });
    }

    performActionReconcile(transactions: ITransactionReport[]) {
        this._moneyService.reconcile(transactions, true).subscribe({
            error: (response) => {
                console.log('Failed to reconcile TRN: ' + response);
            },
            complete: () => {
                this.update();
            }
        });
    }

    performActionUnreconcile(transactions: ITransactionReport[]) {
        this._moneyService.reconcile(transactions, false).subscribe({
            error: (response) => {
                console.log('Failed to reconcile TRN: ' + response);
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
                console.log('Failed to delete TRN: ' + response);
            },
            complete: () => {
                this.update();
            }
        });
    }

    performActionClearAdd(transaction: ITransactionReport) {
        GridTransaction.clearTransaction(transaction, this.filter);

        // Indicate that the transaction changed.
        const event: GridDataEvent = new GridDataEvent();
        event.transaction = transaction;
        event.action = GridDataActionType.ClearAdd;
        event.source = HeaderType.Action;

        this.gridDataChangeHandler.emit(event);
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
                } else {
                    if (next.selected) {
                        transactions.push(next);
                    }
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
                console.log('Pending actions are ignored - ' + event.action);
                break;
        }
    }

    lockStatement(statement: IStatement) {
        console.log('Lock Statement');
        this._moneyService.lockStatement(statement).subscribe({
            error: (response) => {
                console.log('Failed to lock statement ' + response);
            },
            complete: () => {
                this.update();
            }
        });
    }

    clearRecData() {
        console.log(`Clear reconciliation data file {}`);

        this._moneyService.clearRecData().subscribe({
            error: (response) => {
                console.log('Failed to clear rec data ' + response);
            },
            complete: () => {
                this.update();
            }
        });
    }

    selectRecData(file: IFile) {
        console.log(`Load file {}`, file.filename);

        this._moneyService.loadFileRequest(file).subscribe({
            error: (response) => {
                if (environment.production) {
                    console.log('Failed to load file ' + response);
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
