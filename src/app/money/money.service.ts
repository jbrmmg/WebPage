import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Category} from './category/category';
import {JbAccount} from './account/jbAccount';
import {IStatement, Statement} from './statement/statement';
import {IFile} from './files/file';
import {DeleteTransaction, ITransaction, Transaction} from "./transaction/transaction";
import {LockRequest} from "./statement/lockRequest";
import {ReconcileTransaction} from "./reconciliation/reconcileTransaction";
import {LoadFileRequest} from "./files/loadFileRequest";
import {TransactionFilter} from "./transaction/transactionFilter";
import {ITransactionReport, TransactionReport} from "./transaction/transactionReport";
import {ReconcileStatus} from "./reconciliation/reconcileStatus";
import {IVersion, Version} from './money-version';

@Injectable({
    providedIn: 'root'
})
export class MoneyService {
    constructor(private http: HttpClient) {
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

    static getTransactionDescription(transaction: ITransactionReport): string {
        if(transaction.type == TransactionReport.TRANSACTION) {
            if(transaction.description == null || transaction.description.length == 0) {
                return "&nbsp;";
            } else {
                return transaction.description;
            }
        }

        if(transaction.type == TransactionReport.OPEN_BALANCE) {
            return "Opening Balance"
        }

        if(transaction.type == TransactionReport.TODAY_BALANCE) {
            return "Balance Today"
        }

        if(transaction.type == TransactionReport.FUTURE_BALANCE) {
            return "Future Balance"
        }

        return "&nbsp;";
    }

    static getTextColor(colour: string) {
        if(MoneyService.getBrightness(colour) > 130) {
            return '000000';
        }

        return 'FFFFFF';
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

    getStatements(): Observable<Statement[]> {
        return this.http.get<Statement[]>(environment.moneyStatementUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    getTransactions(filter: TransactionFilter) : Observable<ITransactionReport[]>  {
        console.log(JSON.stringify(filter));

        return this.http.post<ITransactionReport[]>(environment.moneyTransactionList,filter).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    getVersion(): Observable<IVersion> {
        return this.http.get<IVersion>(environment.moneyVersion).pipe(
            tap(data => console.log('Version ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    addTransaction(transactions: Transaction[]): Observable<Transaction> {
        return this.http.post<Transaction>(environment.moneyAddUrl, transactions);
    }

    loadFileRequest(file: IFile): Observable<LoadFileRequest> {
        const request: LoadFileRequest = new LoadFileRequest();
        request.filename = file.filename;

        return this.http.post<LoadFileRequest>(environment.moneyLoadFileUrl, request);
    }

    updateTransaction(transaction: ITransactionReport[]): Observable<ITransaction> {
        // Update the transaction provided.
        return this.http.put<ITransaction>(environment.moneyUpdateTransactionUrl, transaction);
    }

    reconcile(transactions: ITransactionReport[], reconcile: boolean): Observable<ReconcileStatus> {
        // Set transaction to confirmed/unconfirmed
        // TransactionId & Flag
        const url = environment.moneyReconcileTransactionUrl;

        const reconcileRequest: ReconcileTransaction = new ReconcileTransaction();
        reconcileRequest.transactions = [];
        transactions.forEach(value => {
            reconcileRequest.transactions.push(value.transactionId);
        })
        reconcileRequest.reconcile = reconcile;

        return this.http.put<ReconcileStatus>(url, reconcileRequest);
    }

    deleteTransaction(transactions: ITransactionReport[]): Observable<Transaction> {
        // Create the request.
        let request: DeleteTransaction[] = [];

        transactions.forEach(value => {
            let nextRequest: DeleteTransaction = new DeleteTransaction();
            nextRequest.id = value.transactionId;

            request.push(nextRequest);
        })

        // Delete the transactions.
        return this.http.delete<Transaction>(environment.moneyDeleteTransactionUrl, {
            body: request
        });
    }

    lockStatement(statement: IStatement): Observable<void> {
        // Lock the statement.
        // Account, Month & Year

        statement.locked = true;

        const url = environment.moneyLockStatementUrl;

        const lockRequest = new LockRequest();

        lockRequest.accountId = statement.accountId;
        lockRequest.year = statement.year;
        lockRequest.month = statement.month;

        return this.http.post<void>(url, lockRequest);
    }

    clearRecData(): Observable<void> {
        // Clear the rec data.
        return this.http.delete<void>(environment.moneyClearDataUrl);
    }

    fileUpdateSource() : EventSource {
        return new EventSource(environment.moneyFileUpdates);
    }

    getAccountImage(id: string): string {
        return MoneyService.getAccountImage(id);
    }
}
