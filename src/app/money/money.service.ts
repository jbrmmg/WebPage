import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Category, ICategory} from './category/category';
import {JbAccount,IAccount} from './account/jbaccount';
import {ITransactionType, TransactionType} from './transaction/type';
import {IStatement, Statement} from './statement/statement';
import {IMatch} from './reconciliation/match';
import {IRegular} from './transaction/regular';
import {IFile} from './files/file';
import {ITransaction, Transaction} from "./transaction/transaction";
import {LockRequest} from "./statement/lockrequest";
import {UpdateTransactionRequest} from "./transaction/updatetransactionrequest";
import {ReconcileUpdate} from "./reconciliation/reconcileupdate";
import {ReconcileTransaction} from "./reconciliation/reconciletransaction";
import {LoadFileRequest} from "./files/loadfilerequest";
import {TransactionFilter} from "./transaction/transactionFilter";
import {ITransactionReport} from "./transaction/TransactionReport";

@Injectable({
    providedIn: 'root'
})
export class MoneyService {
    private reconcileAccount: IAccount;

    @Output() updateTransactions: EventEmitter<any> = new EventEmitter();
    @Output() updateStatements: EventEmitter<any> = new EventEmitter();

    constructor(private http: HttpClient) {
        this.reconcileAccount = null;
    }

    public static dateToString(value: Date): string {
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

    public static stringToDate(value: string): Date {
        let result : Date = new Date();

        result.setFullYear(parseInt(value.substring(0,4)));
        result.setMonth(parseInt(value.substring(5,7)));
        result.setDate(parseInt(value.substring(8)));
        result.setHours(0);
        result.setMinutes(0);
        result.setSeconds(0);
        result.setMilliseconds(0);

        return result;
    }

    public static transferCategory(): string {
        return "TRF";
    }

    public static getAccountImage(id: string): string {
        return environment.moneyAccountImage.replace("##id##", id)
    }

    public static getDateString(date: Date) : string {
        return date.toISOString().split('T')[0];
    }

    public static getValidDateForMonth(text: string, month: number, year: number): number {
        let number = Number(text);
        if(!isNaN(number)) {
            switch(month) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12: {
                    if(number >= 1 && number <= 31) {
                        return number;
                    }
                    break;
                }

                case 4:
                case 6:
                case 9:
                case 11: {
                    if(number >= 1 && number <= 30) {
                        return number;
                    }
                    break;
                }

                case 2: {
                    if(number >= 1) {
                        if (number <= 28) {
                            return number;
                        }

                        if(number <= 29) {
                            let divBy4: boolean = (year % 4) == 0;
                            let divBy100: boolean = (year % 100) == 0;
                            let divBy400: boolean = (year % 400) == 0;

                            if(divBy4 && !divBy100 && divBy400) {
                                return number;
                            }
                        }
                    }
                }
            }
        }

        return 0;
    }

    public static isStringADate(text: string): string {
        let dateParts: string[] = text.split("-");

        if(dateParts.length != 3) {
            return null;
        }

        let year = Number(dateParts[0]);
        if(isNaN(year)) {
            return null;
        }

        let month = Number(dateParts[1]);
        if(isNaN(month)) {
            return null;
        }

        if(year < 100) {
            year = year + 2000;
        }

        if(year > 2070 || year < 2010) {
            return null;
        }

        if(month < 1 || month > 12) {
            return null;
        }

        let day = this.getValidDateForMonth(dateParts[2],month,year);
        if(day == 0) {
            return null;
        }

        let thisDate = new Date(year,month - 1,day);

        return this.dateToString(thisDate);
    }

    public static getDate(text: string) : string {
        // Setup today
        let today = new Date();

        // If the text is blank, empty or a T then set the date to today.
        if(text == null || text.toLowerCase() == "t" || text == "") {
            return this.getDateString(today);
        }

        // Is the value a number that can be interpreted as the day of the current month.
        let day = this.getValidDateForMonth(text, today.getMonth() + 1, today.getFullYear());
        if(day > 0) {
            today.setDate(day);
            return MoneyService.getDateString(today);
        }

        // Try to interpret the string as a date.
        let dateString = this.isStringADate(text);
        if(dateString != null) {
            return dateString;
        }

        return MoneyService.getDateString(today);
    }

    public static getFinanceValue(text: string): number {
        // Remove £ and , for the evaluation.
        text = text.replace("£","").replace(",","");

        // Is the value a number?
        let number = Number(text);

        if(isNaN(number)) {
            return 0;
        }

        return number;
    }

    public static getDisabledAccountImage(id: string): string {
        return environment.moneyAccountDisabledImage.replace("##id##", id)
    }

    private static handleError(err: HttpErrorResponse) {
        let errorMessage: string;
        if (err.error instanceof ErrorEvent) {
            errorMessage = 'An error occurred: ';
        } else {
            errorMessage = 'Server returned code ' + err.status + ', error message is: ' + err.message;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage) );
    }

    static getBrightness(colour: string): number {
        const red: number = parseInt(colour.substring(0, 2), 16);
        const green: number = parseInt(colour.substring(2, 4), 16);
        const blue: number = parseInt(colour.substring(4, 6), 16);

        return Math.sqrt(red * red * .241 + green * green * .691 + blue * blue * .068);
    }

    static getTextColor(colour: string) {
        if(MoneyService.getBrightness(colour) > 130) {
            return '000000';
        }

        return 'FFFFFF';
    }

    public getReconcileAccount() : IAccount {
        return this.reconcileAccount;
    }

    public setReconcileAccount(account: IAccount): void {
        this.reconcileAccount = account;
    }

    getFiles(): Observable<IFile[]> {
        return this.http.get<IFile[]>(environment.moneyGetFilesUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError( err => MoneyService.handleError(err))
        );
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(environment.moneyCategoryUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    getAccounts(): Observable<JbAccount[]> {
        return this.http.get<JbAccount[]>(environment.moneyAccountUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    getTransactionTypes(): Observable<TransactionType[]> {
        return this.http.get<TransactionType[]>(environment.moneyTypeUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    getStatements(): Observable<Statement[]> {
        return this.http.get<Statement[]>(environment.moneyStatementUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    getRegularPayments(): Observable<IRegular[]> {
        return this.http.get<IRegular[]>(environment.moneyGetRegularUrl).pipe(
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
        let typeId: string = 'XX';
        let result: string = environment.moneyTransactionUrlFormat;

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

    getTransactions(filter: TransactionFilter) : Observable<ITransactionReport[]>  {
        console.log(JSON.stringify(filter));

        return this.http.post<ITransactionReport[]>(environment.moneyTransactionList,filter).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    addTransaction(transactions: Transaction[]) {
        this.http.post<Transaction>(environment.moneyAddUrl, transactions).subscribe({
            next: (val) => { console.log('POST (add transaction) call successful value returned in body', val); },
            error: (response) => { console.log('POST (add transaction) call in error', response); },
            complete: () => {
                console.log('The POST (add transaction) observable is now complete');
                this.updateTransactions.emit(null);
            }
        });
    }

    loadFileRequest(file: IFile) {
        this.setReconcileAccount(file.account);

        const request: LoadFileRequest = new LoadFileRequest();
        request.filename = file.filename;

        this.http.post<LoadFileRequest>(environment.moneyLoadFileUrl, request).subscribe({
            next: (val)=> { console.log('POST (load file) call successful value returned in body', val); },
            error: (response) => {
                console.log('POST (load file) call in error', response);
                if (!environment.production) {
                    console.log('Testing - process as complete.', response);
                    this.updateTransactions.emit(null);
                }
            },
            complete: () => {
                console.log('The POST observable is now complete (load)');
                this.updateTransactions.emit(null);
            }
        });
    }

    updateTransaction(transaction: ITransaction) {
        // Update the amount of the transaction.
        // TransactionId & Amount

        const url = environment.moneyUpdateTransactionUrl;

        const updateRequest = new UpdateTransactionRequest();
        updateRequest.id = transaction.id;
        updateRequest.amount = transaction.amount;
        updateRequest.description = transaction.description;
        updateRequest.categoryId = transaction.categoryId;

        this.http.put<void>(url, updateRequest).subscribe({
            next:() => {
                console.log(url);
            },
            error: (response) => {
                console.log('PUT call in error', response);
                if (!environment.production) {
                    console.log('Testing - process as complete.', response);
                    this.updateTransactions.emit(null);
                }
            },
            complete: () => {
                this.updateTransactions.emit(null);
            }
        });
    }

    confirmTransaction(transaction: ITransaction,
                       reconcile: boolean ) {
        // Set transaction to confirmed/unconfirmed
        // TransactionId & Flag
        const url = environment.moneyReconcileTransactionUrl;

        const reconcileRequest: ReconcileTransaction = new ReconcileTransaction();
        reconcileRequest.transactionId = transaction.id;
        reconcileRequest.reconcile = reconcile;

        this.http.put<void>(url, reconcileRequest).subscribe({
            next: () => {
                console.log(url);
            },
            error: (response) => {
                console.log('PUT call in error', response);
                if (!environment.production) {
                    console.log('Testing - process as complete.', response);
                    this.updateTransactions.emit(null);
                }
            },
            complete: () => {
                console.log('The PUT observable is now complete (confirm)');
                this.updateTransactions.emit(null);
            }
        });
    }

    getTransactionChangeEmitter() {
        return this.updateTransactions;
    }

    getStatementChangeEmitter() {
        return this.updateStatements;
    }

    deleteTransaction(transaction: ITransaction ) {
        // Delete the transaction.
        this.http.delete<Transaction>(environment.moneyDeleteTransactionUrl, {
            body: transaction
        }).subscribe({
            next: () => {
                console.log(environment.moneyDeleteTransactionUrl);
            },
            error: (response) => {
                console.log('DELETE call in error', response);
                if (!environment.production) {
                    console.log('Testing - process as complete.', response);
                    this.updateTransactions.emit(null);
                }
            },
            complete: () => {
                console.log('The POST observable is now complete (delete)');
                this.updateTransactions.emit(null);
            }
        });
    }

    lockStatement(statement: IStatement) {
        // Lock the statement.
        // Account, Month & Year

        statement.locked = true;

        const url = environment.moneyLockStatementUrl;

        const lockRequest = new LockRequest();

        lockRequest.accountId = statement.accountId;
        lockRequest.year = statement.year;
        lockRequest.month = statement.month;

        this.http.post<void>(url, lockRequest).subscribe({
            next:() => {
                console.log(url);
            },
            error: (response) => {
                console.log('POST call in error', response);
                if (!environment.production) {
                    console.log('Testing - process as complete.', response);
                    this.updateStatements.emit(null);
                    this.updateTransactions.emit(null);
                }
            },
            complete: () => {
                console.log('The POST observable is now complete (lock)');
                this.updateStatements.emit(null);
                this.updateTransactions.emit(null);
            }
        });
    }

    getMatches(account: IAccount): Observable<IMatch[]> {
        let url = environment.moneyMatchUrl;
        url = url.replace('##accountId##', account.id);

        return this.http.get<IMatch[]>(url).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    clearRecData() {
        // Clear the rec data.
        this.http.delete<void>(environment.moneyClearDataUrl).subscribe({
            next:() => {
                console.log(environment.moneyClearDataUrl);
            },
            error: (response) => {
                console.log('Clear POST call in error', response);
            },
            complete: () => {
                console.log('Clear The POST observable is now complete (delete)');
            }
        });
    }

    autoAccept() {
        // Auto accept the data.
        this.http.put<void>(environment.moneyAutoAcceptUrl, '').subscribe({
            next:() => {
                console.log(environment.moneyAutoAcceptUrl);
            },
            error: (response) => {
                console.log('Auto Accept PUT call in error', response);
            },
            complete: () => {
                console.log('Auto Accept The PUT observable is now complete (delete)');

                // Update transactions
                this.updateTransactions.emit(null);
            }
        });
    }

    setCategory(matchRow: IMatch, category: ICategory) {
        // Set the category
        const url = environment.moneySetCategoryUrl;

        const request: ReconcileUpdate = new ReconcileUpdate();

        request.id = matchRow.id;
        request.categoryId = category.id;
        request.type = 'rec';

        this.http.put<void>(url, request).subscribe({
            next:() => {
                console.log(url);
            },
            error: (response) => {
                console.log('Set Cat PUT call in error', response);
            },
            complete: () => {
                console.log('Set Cat PUT observable is now complete (delete)');
            }
        });
    }

    fileUpdateSource() : EventSource {
        return new EventSource('money/reconciliation/file-updates');
    }
}
