import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Category, ICategory} from './money-category';
import {JbAccount} from './money-account';
import {ITransactionType, TransactionType} from './money-type';
import {IStatement, Statement} from './money-statement';
import {IMatch} from './money-match';
import {IRegular} from './money-regular';
import {IFile} from './money-file';
import {ITransaction} from './list-row-line/list-row-summary';

export class NewTransaction {
    date: Date;
    amount: number;
    categoryId: string;
    accountId: string;
    accountTransfer: boolean;
    transferAccountId: string;
    description: string;
}

export class LockRequest {
    accountId: string;
    year: number;
    month: number;
}

export class ReconcileUpdate {
    id: number;
    categoryId: string;
    type: string;
}

export class ReconcileTransaction {
    transactionId: number;
    reconcile: boolean;
}

export class UpdateTransactionRequest {
    id: number;
    amount: number;
    description: string;
    categoryId: string;
}

export class LoadFileRequest {
    path: string;
    type: string;
}

@Injectable({
    providedIn: 'root'
})
export class MoneyService {
    private readonly testFormat = 'api/money/transaction.##type##.json';
    private readonly prodFormat = 'money/transaction/get?sortAscending=false&type=##type##[from][to][account][category]';

    private readonly categoryUrl;
    private readonly accountUrl;
    private readonly addUrl;
    private readonly typeUrl;
    private readonly statementUrl;
    private readonly updateTransactionUrl;
    private readonly deleteTransactionUrl;
    private readonly lockStatementUrl;
    private readonly reconcileTransactionUrl;
    private readonly matchUrl;
    private readonly submitDataUrl;
    private readonly clearDataUrl;
    private readonly autoAcceptUrl;
    private readonly setCategoryUrl;
    private readonly getRegularUrl;
    private readonly getFilesUrl;
    private readonly loadFileUrl;

    @Output() updateTransactions: EventEmitter<any> = new EventEmitter();
    @Output() updateStatements: EventEmitter<any> = new EventEmitter();

    constructor(private http: HttpClient) {
        this.typeUrl = 'api/money/types.json';
        if (environment.production) {
            // Use production URL's
            this.categoryUrl = 'money/categories';
            this.accountUrl = 'money/accounts';
            this.addUrl = 'money/transaction';
            this.statementUrl = 'money/statement';
            this.updateTransactionUrl = 'money/transaction';
            this.deleteTransactionUrl = 'money/transaction';
            this.lockStatementUrl = 'money/statement/lock';
            this.reconcileTransactionUrl = 'money/reconcile';
            this.matchUrl = 'money/match?account=##accountId##';
            this.clearDataUrl = 'money/reconciliation/clear';
            this.autoAcceptUrl = 'money/reconciliation/auto';
            this.setCategoryUrl = 'money/reconciliation/update';
            this.getRegularUrl = 'money/transaction/regulars';
            this.getFilesUrl = 'money/reconciliation/files';
            this.loadFileUrl = 'money/reconciliation/load';
        } else {
            this.categoryUrl = 'api/money/category.json';
            this.accountUrl = 'api/money/account.json';
            this.addUrl = 'api/money/account.json';
            this.statementUrl = 'api/money/statements.json';
            this.updateTransactionUrl = 'api/money/update.json';
            this.deleteTransactionUrl = 'api/money/update.json';
            this.lockStatementUrl = 'api/money/update.json';
            this.reconcileTransactionUrl = 'api/money/update.json';
            this.matchUrl = 'api/money/match.##accountId##.json';
            this.clearDataUrl = 'api/money/update.json';
            this.autoAcceptUrl = 'api/money/update.json';
            this.setCategoryUrl = 'api/money/update.json';
            this.getRegularUrl = 'api/money/regular.json';
            this.getFilesUrl = 'api/money/reconcile.files.json';
            this.loadFileUrl = 'api/money/reconcile.files.json';
        }
    }

    private static dateToString(value: Date): string {
        let result = '';

        result += value.getFullYear().toString();
        result += '-';
        if (value.getMonth() + 1 < 10) {
            result += '0';
        }
        result += (value.getMonth() + 1).toString();
        result += '-';
        if (value.getDate() < 10) {
            result += '0';
        }
        result += value.getDate().toString();

        return result;
    }

    static getAccountImage(id: string): string {
        if (environment.production) {
            return 'money/account/logo?disabled=false&id=' + id;
        } else {
            return `assets/images/account/${id}.svg`;
        }
    }

    static getDisabledAccountImage(id: string): string {
        if (environment.production) {
            return 'money/account/logo?disabled=true&id=' + id;
        } else {
            return `assets/images/account/${id}x.svg`;
        }
    }

    private static handleError(err: HttpErrorResponse) {
        let errorMessage;
        if (err.error instanceof ErrorEvent) {
            errorMessage = 'An error occurred: ';
        } else {
            errorMessage = 'Server returned code ' + err.status + ', error message is: ' + err.message;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }

    static getBrightness(colour: string): number {
        const red: number = parseInt(colour.substring(0, 2), 16);
        const green: number = parseInt(colour.substring(2, 4), 16);
        const blue: number = parseInt(colour.substring(4, 6), 16);

        return Math.sqrt(red * red * .241 + green * green * .691 + blue * blue * .068);
    }

    getFiles(): Observable<IFile[]> {
        return this.http.get<IFile[]>(this.getFilesUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError( err => MoneyService.handleError(err))
        );
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.categoryUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    getAccounts(): Observable<JbAccount[]> {
        return this.http.get<JbAccount[]>(this.accountUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    getTransactionTypes(): Observable<TransactionType[]> {
        return this.http.get<TransactionType[]>(this.typeUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    getStatements(): Observable<Statement[]> {
        return this.http.get<Statement[]>(this.statementUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    getRegularPayments(): Observable<IRegular[]> {
        return this.http.get<IRegular[]>(this.getRegularUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    private getTransactionsUrl(type: ITransactionType,
                               from: Date,
                               to: Date,
                               accounts: JbAccount[],
                               categories: Category[]): string {

        let fromClause: string = null;
        let toClause: string = null;
        let categoryClause: string = null;
        let accountClause: string = null;
        let typeId = 'XX';
        let result = (environment.production ? this.prodFormat : this.testFormat);

        // Calculate the clauses
        if (type != null) {
            typeId = type.id;

            if (from != null) {
                if (type.id === 'RC' || type.id === 'AL') {
                    fromClause = '&from=' + MoneyService.dateToString(from);
                }
            }

            if (to != null) {
                if (type.id === 'AL') {
                    toClause = '&to=' + MoneyService.dateToString(to);
                }
            }
        }

        if (accounts != null) {
            let allAccount = true;

            accounts.forEach(value => {
                if (!value.selected) {
                    allAccount = false;
                }
            });

            if (!allAccount) {
                let addComma = false;
                accountClause = '&account=';

                accounts.forEach(value => {
                    if (value.selected) {
                        if (addComma) {
                            accountClause += ',';
                        }
                        accountClause += value.id;
                        addComma = true;
                    }
                });
            }
        }

        if (categories != null) {
            let allCategories = true;

            categories.forEach(value => {
                if (!value.selected) {
                    allCategories = false;
                }
            });

            if (!allCategories) {
                let addComma = false;
                categoryClause = '&category=';

                categories.forEach(value => {
                    if (value.selected) {
                        if (addComma) {
                            categoryClause += ',';
                        }
                        categoryClause += value.id;
                        addComma = true;
                    }
                });
            }
        }

        console.log('Criteria -  ' + fromClause + ' ' + toClause + ' ' + accountClause + ' ' + categoryClause);

        // Apply the clauses.
        result = result.replace('##type##', typeId);
        result = result.replace('[from]', (fromClause == null ? '' : fromClause));
        result = result.replace('[to]', (toClause == null ? '' : toClause));
        result = result.replace('[account]', (accountClause == null ? '' : accountClause));
        result = result.replace('[category]', (categoryClause == null ? '' : categoryClause));

        console.log(result);

        return result;
    }

    getTransactions(type: ITransactionType,
                    from: Date,
                    to: Date,
                    accounts: JbAccount[],
                    categories: Category[]): Observable<ITransaction[]> {

        return this.http.get<ITransaction[]>(this.getTransactionsUrl(type, from, to, accounts, categories)).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    addTransaction(transaction: NewTransaction) {
        this.http.post<NewTransaction>(this.addUrl, transaction).subscribe(
            (val) => {
                console.log('POST call successful value returned in body', val);
            },
            (response) => {
                console.log('POST call in error', response);
            },
            () => {
                console.log('The POST observable is now complete (add)');
                this.updateTransactions.emit(null);
            }
        );
    }

    loadFileRequest(file: IFile, account: JbAccount) {
        const request: LoadFileRequest = new LoadFileRequest();
        request.path = file.file;
        request.type = JbAccount.getFileType(account.id);

        this.http.post<LoadFileRequest>(this.loadFileUrl, request).subscribe(
            (val) => {
                console.log('POST call successful value returned in body', val);
            },
            (response) => {
                console.log('POST call in error', response);
                if (!environment.production) {
                    console.log('Testing - process as complete.', response);
                    this.updateTransactions.emit(null);
                }
            },
            () => {
                console.log('The POST observable is now complete (load)');
                this.updateTransactions.emit(null);
            }
        );
    }

    updateTransaction(transaction: ITransaction) {
        // Update the amount of the transaction.
        // TransactionId & Amount

        const url = this.updateTransactionUrl;

        const updateRequest = new UpdateTransactionRequest();
        updateRequest.id = transaction.id;
        updateRequest.amount = transaction.amount;
        updateRequest.description = transaction.description;
        updateRequest.categoryId = transaction.category.id;

        this.http.put<void>(url, updateRequest).subscribe(
            () => {
                console.log(url);
            },
            (response) => {
                console.log('PUT call in error', response);
                if (!environment.production) {
                    console.log('Testing - process as complete.', response);
                    this.updateTransactions.emit(null);
                }
            },
            () => {
                this.updateTransactions.emit(null);
            });
    }

    confirmTransaction(transaction: ITransaction,
                       reconcile: boolean ) {
        // Set transaction to confirmed/unconfirmed
        // TransactionId & Flag
        const url = this.reconcileTransactionUrl;

        const reconcileRequest: ReconcileTransaction = new ReconcileTransaction();
        reconcileRequest.transactionId = transaction.id;
        reconcileRequest.reconcile = reconcile;

        this.http.put<void>(url, reconcileRequest).subscribe(
            () => {
                console.log(url);
            },
            (response) => {
                console.log('PUT call in error', response);
                if (!environment.production) {
                    console.log('Testing - process as complete.', response);
                    this.updateTransactions.emit(null);
                }
            },
            () => {
                console.log('The PUT observable is now complete (confirm)');
                this.updateTransactions.emit(null);
            }
        );
    }

    getTransactionChangeEmitter() {
        return this.updateTransactions;
    }

    getStatementChangeEmitter() {
        return this.updateStatements;
    }

    deleteTransaction(transaction: ITransaction ) {
        // Delete the transaction.
        // TransactionId
        let url = this.deleteTransactionUrl;
        url = url.replace('##transactionId##', transaction.id.toString());

        this.http.delete<void>(url).subscribe(() => {
            console.log(url);
        },
        (response) => {
            console.log('POST call in error', response);
            if (!environment.production) {
                console.log('Testing - process as complete.', response);
                this.updateTransactions.emit(null);
            }
        },
        () => {
            console.log('The POST observable is now complete (delete)');
            this.updateTransactions.emit(null);
        });
    }

    lockStatement(statement: IStatement) {
        // Lock the statement.
        // Account, Month & Year

        statement.locked = true;

        const url = this.lockStatementUrl;

        const lockRequest = new LockRequest();

        lockRequest.accountId = statement.id.account.id;
        lockRequest.year = statement.id.year;
        lockRequest.month = statement.id.month;

        this.http.post<void>(url, lockRequest).subscribe(() => {
            console.log(url);
        },
        (response) => {
            console.log('POST call in error', response);
            if (!environment.production) {
                console.log('Testing - process as complete.', response);
                this.updateStatements.emit(null);
                this.updateTransactions.emit(null);
            }
        },
        () => {
            console.log('The POST observable is now complete (lock)');
            this.updateStatements.emit(null);
            this.updateTransactions.emit(null);
        });
    }

    getMatches(account: JbAccount): Observable<IMatch[]> {
        let url = this.matchUrl;
        url = url.replace('##accountId##', account.id);

        return this.http.get<IMatch[]>(url).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    clearRecData() {
        // Clear the rec data.
        this.http.delete<void>(this.clearDataUrl).subscribe(() => {
                console.log(this.clearDataUrl);
            },
            (response) => {
                console.log('Clear POST call in error', response);
            },
            () => {
                console.log('Clear The POST observable is now complete (delete)');
            });
    }

    autoAccept() {
        // Auto accept the data.
        this.http.put<void>(this.autoAcceptUrl, '').subscribe(() => {
                console.log(this.autoAcceptUrl);
            },
            (response) => {
                console.log('Auto Accept PUT call in error', response);
            },
            () => {
                console.log('Auto Accept The PUT observable is now complete (delete)');

                // Update transactions
                this.updateTransactions.emit(null);
            });
    }

    setCategory(matchRow: IMatch, category: ICategory) {
        // Set the category
        const url = this.setCategoryUrl;

        const request: ReconcileUpdate = new ReconcileUpdate();

        request.id = matchRow.id;
        request.categoryId = category.id;
        request.type = 'rec';

        this.http.put<void>(url, request).subscribe(() => {
                console.log(url);
            },
            (response) => {
                console.log('Set Cat PUT call in error', response);
            },
            () => {
                console.log('Set Cat PUT observable is now complete (delete)');
            });
    }
}
