import {EventEmitter, Injectable, Output} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {Category, ICategory} from "./money-category";
import {JbAccount} from "./money-account";
import {ITransactionType, TransactionType} from "./money-type";
import {ITransaction, Transaction} from "./money-transaction";
import {Statement} from "./money-statement";
import {IMatch, Match} from "./money-match";
import {IRegular} from "./money-regular";
import {IFile} from "./money-file";

export class NewTransaction {
    date: Date;
    amount: number;
    category: string;
    account: string;
    accountTransfer: boolean;
    transferAccount: string;
    description: string;
}

export class StatusResponse {
    status: string;
    message: string;
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
    category: string;
}

export class LoadFileRequest {
    path: string;
    type: string;
}

@Injectable({
    providedIn: 'root'
})
export class MoneyService {
    private  testFormat = 'api/money/transaction.##type##.json';
    private  prodFormat = 'money/transaction/get?sortAscending=false&type=##type##[from][to][account][category]';

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

    constructor(private http: HttpClient) {
        this.typeUrl = 'api/money/types.json';
        if(environment.production) {
            // Use production URL's
            this.categoryUrl = 'money/categories';
            this.accountUrl = 'money/accounts';
            this.addUrl = 'money/transaction/add';
            this.statementUrl = 'money/statement';
            this.updateTransactionUrl = 'money/transaction/update';
            this.deleteTransactionUrl = 'money/delete?transactionId=##transactionId##';
            this.lockStatementUrl = 'money/statement/lock';
            this.reconcileTransactionUrl = 'money/reconcile';
            this.matchUrl = 'money/match?account=##accountId##';
            this.submitDataUrl = 'money/reconciliation/add';
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
            this.updateTransactionUrl = 'api/money/updatetran.json';
            this.deleteTransactionUrl = 'api/money/updatetran.json';
            this.lockStatementUrl = 'api/money/updatetran.json';
            this.reconcileTransactionUrl = 'api/money/updatetran.json';
            this.matchUrl = 'api/money/match.##accountId##.json';
            this.submitDataUrl = 'api/money/updatetran.json';
            this.clearDataUrl = 'api/money/updatetran.json';
            this.autoAcceptUrl = 'api/money/updatetran.json';
            this.setCategoryUrl = 'api/money/updatetran.json';
            this.getRegularUrl = 'api/money/regular.json';
            this.getFilesUrl = 'api/money/recfiles.json';
            this.loadFileUrl = 'api/money/recfiles.json';
        }
    }

    @Output() updateTransactions: EventEmitter<any> = new EventEmitter();

    getFiles(): Observable<IFile[]> {
        return this.http.get<IFile[]>(this.getFilesUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError( err => MoneyService.handleError(err))
        );
    }

    getCatories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.categoryUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    getAccounts(): Observable<JbAccount[]> {
        return this.http.get<JbAccount[]>(this.accountUrl).pipe(
            tap(data=>console.log('All: ' + JSON.stringify(data))),
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

    private static dateToString(value: Date) : string {
        let result: string = "";

        result += value.getFullYear().toString();
        result += "-";
        if(value.getMonth() + 1 < 10) {
            result += "0";
        }
        result += (value.getMonth() + 1).toString();
        result += "-";
        if(value.getDate() < 10) {
            result += "0";
        }
        result += value.getDate().toString();

        return result;
    }

    static getStatementId(fromDate: Date) {
        let statementId = fromDate.getFullYear().toString();

        let month = fromDate.getMonth() + 1;

        if(month < 10)
        {
            statementId = statementId + "0";
        }

        statementId = statementId + month.toString();

        return statementId;
    }

    private getTransactionsUrl(type: ITransactionType,
                               from: Date,
                               to: Date,
                               accounts: JbAccount[],
                               categories: Category[]): string {

        let fromClause:string = null;
        let toClause:string = null;
        let categoryClause:string = null;
        let accountClause:string = null;
        let typeId:string = "XX";
        let result:string = (environment.production ? this.prodFormat : this.testFormat);

        // Calculate the clauses
        if(type != null) {
            typeId = type.id;

            if (from != null) {
                if (type.id == "RC" || type.id == "AL") {
                    fromClause = "&from=" + MoneyService.dateToString(from);
                }
            }

            if (to != null) {
                if (type.id == "AL") {
                    toClause = "&to=" + MoneyService.dateToString(to);
                }
            }
        }

        if(accounts != null)
        {
            let allAccount: boolean = true;

            accounts.forEach(value => {
                if(!value.selected) {
                    allAccount = false;
                }
            });

            if(!allAccount) {
                let addComma: boolean = false;
                accountClause = "&account=";

                accounts.forEach(value => {
                    if(value.selected) {
                        if (addComma) {
                            accountClause += ",";
                        }
                        accountClause += value.id;
                        addComma = true;
                    }
                })
            }
        }

        if(categories != null)
        {
            let allCategories: boolean = true;

            categories.forEach(value => {
                if(!value.selected) {
                    allCategories = false;
                }
            });

            if(!allCategories) {
                let addComma: boolean = false;
                categoryClause = "&category=";

                categories.forEach(value => {
                    if(value.selected) {
                        if (addComma) {
                            categoryClause += ",";
                        }
                        categoryClause += value.id;
                        addComma = true;
                    }
                })
            }
        }

        console.log("Criteria -  " + fromClause + " " + toClause + " " + accountClause + " " + categoryClause);

        // Apply the clauses.
        result = result.replace("##type##",typeId);
        result = result.replace("[from]", (fromClause == null ? "" : fromClause));
        result = result.replace("[to]", (toClause == null ? "" : toClause));
        result = result.replace("[account]", (accountClause == null ? "" : accountClause));
        result = result.replace("[category]", (categoryClause == null ? "" : categoryClause));

        console.log(result);

        return result;
    }

    getTransactions(type: ITransactionType,
                    from: Date,
                    to: Date,
                    accounts: JbAccount[],
                    categories: Category[]) : Observable<ITransaction[]> {

        return this.http.get<ITransaction[]>(this.getTransactionsUrl(type,from,to,accounts,categories)).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    addTransaction(transaction: NewTransaction) {
        this.http.post<NewTransaction>(this.addUrl,transaction).subscribe(
            (val) => {
                console.log("POST call successful value returned in body", val)
            },
            (response) => {
                console.log("POST call in error", response);
            },
            () => {
                console.log("The POST observable is now complete (add)");
                this.updateTransactions.emit(null);
            }
        );
    }

    loadFileRequest(path: string, type: string) {
        let request: LoadFileRequest = new LoadFileRequest();
        request.path = path;
        request.type = type;

        this.http.post<LoadFileRequest>(this.loadFileUrl,request).subscribe(
            (val) => {
                console.log("POST call successful value returned in body", val);
            },
            (response) => {
                console.log("POST call in error", response);
            },
            () => {
                console.log("The POST observable is now complete (load)");
            }
        );
    }

    static getAccountImage(id: string): string {
        // Known ids
        switch(id) {
            case "AMEX":
            case "BANK":
            case "JLPC":
            case "NWDE": {
                return "assets/images/account/" + id + ".svg";
            }
        }

        return "assets/images/account/UNKN.svg";
    }

    static getDisabledAccountImage(id: string): string {
        // Known ids
        switch(id) {
            case "AMEX":
            case "BANK":
            case "JLPC":
            case "NWDE": {
                return "assets/images/account/" + id + "x.svg";
            }
        }

        return "assets/images/account/UNKN.svg";
    }

    private static handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if(err.error instanceof ErrorEvent) {
            errorMessage = 'An error occured: ';
        } else {
            errorMessage = 'Server returned code ' + err.status + ', error message is: ' + err.message;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }

    updateTransaction(transaction: Transaction) {
        // Update the amount of the transaction.
        // TransactionId & Amount

        let url = this.updateTransactionUrl;

        let updateRequest = new UpdateTransactionRequest();
        updateRequest.id = transaction.id;
        updateRequest.amount = transaction.amount;
        updateRequest.description = transaction.description;
        updateRequest.category = transaction.categoryId;

        this.http.put<StatusResponse>(url, updateRequest).subscribe(
            () => {
                console.log(url);
            },
            (response) => {
                console.log("PUT call in error", response);
            },
            () => {
                this.updateTransactions.emit(null);
            });
    }

    confirmTransaction(transaction: Transaction ) {
        // Set transaction to confirmed/unconfirmed
        // TransactionId & Flag
        transaction.reconciled = !transaction.reconciled;

        let url = this.reconcileTransactionUrl;

        let reconcileRequest: ReconcileTransaction = new ReconcileTransaction();
        reconcileRequest.transactionId = transaction.id;
        reconcileRequest.reconcile = transaction.reconciled;

        this.http.put<StatusResponse>(url,reconcileRequest).subscribe(
            () => {
                console.log(url);
            },
            (response) => {
                console.log("PUT call in error", response);
            },
            () => {
                console.log("The PUT observable is now complete (confirm)");
                this.updateTransactions.emit(null);
            }
        );
    }

    getTransactionChangeEmitter() {
        return this.updateTransactions;
    }

    deleteTransaction(transaction: Transaction ) {
        // Delete the transaction.
        // TransactionId
        let url = this.deleteTransactionUrl;
        url = url.replace("##transactionId##",transaction.id.toString());

        this.http.delete<StatusResponse>(url).subscribe(() => {
            console.log(url);
        },
        (response) => {
            console.log("POST call in error", response);
        },
        () => {
            console.log("The POST observable is now complete (delete)");
            this.updateTransactions.emit(null);
        });
    }

    lockStatement(statement: Statement) {
        // Lock the statement.
        // Account, Month & Year

        statement.locked = true;

        let url = this.lockStatementUrl;

        let lockRequest = new LockRequest();

        lockRequest.accountId = statement.account;
        lockRequest.year = statement.year;
        lockRequest.month = statement.month;

        this.http.post<StatusResponse>(url,lockRequest).subscribe(() => {
            console.log(url);
        },
        (response) => {
            console.log("POST call in error", response);
        },
        () => {
            console.log("The POST observable is now complete (lock)");
            this.updateTransactions.emit(null);
        });
    }

    getMatches(account: JbAccount) : Observable<IMatch[]> {
        let url = this.matchUrl;
        url = url.replace("##accountId##", account.id);

        return this.http.get<IMatch[]>(url).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => MoneyService.handleError(err))
        );
    }

    submitRecData(textData: string){
        // Submit the rec data.
        this.http.post<string>(this.submitDataUrl,textData).subscribe(
            (val) => {
                console.log("Submit data - POST call successful value returned in body", val)
            },
            (response) => {
                console.log("Submit data - POST call in error", response);
            },
            () => {
                console.log("Submit data - The POST observable is now complete (add)");
            }
        );
    }

    clearRecData() {
        // Clear the rec data.
        this.http.delete<StatusResponse>(this.clearDataUrl).subscribe(() => {
                console.log(this.clearDataUrl);
            },
            (response) => {
                console.log("Clear POST call in error", response);
            },
            () => {
                console.log("Clear The POST observable is now complete (delete)");
            });
    }

    autoAccept() {
        // Auto accept the data.
        this.http.put<StatusResponse>(this.autoAcceptUrl,"").subscribe((response) => {
                console.log(this.autoAcceptUrl + " -> " + response.status);
            },
            (response) => {
                console.log("Auto Accept PUT call in error", response);
            },
            () => {
                console.log("Auto Accept The PUT observable is now complete (delete)");
            });
    }

    setCategory(matchRow: Match, category: ICategory) {
        // Set the category
        let url = this.setCategoryUrl;

        let request: ReconcileUpdate = new ReconcileUpdate();

        request.id = matchRow.id;
        request.categoryId = category.id;
        request.type = "rec";

        this.http.put<StatusResponse>(url,request).subscribe((response) => {
                console.log(url + " -> " + response.status + " " + response.message);
            },
            (response) => {
                console.log("Set Cat PUT call in error", response);
            },
            () => {
                console.log("Set Cat PUT observable is now complete (delete)");
            });
    }

    static getBrightness(colour: string): number {
        let red: number = parseInt(colour.substring(0, 2), 16);
        let green: number = parseInt(colour.substring(2, 4), 16);
        let blue: number = parseInt(colour.substring(4, 6), 16);

        return Math.sqrt(red * red * .241 + green * green * .691 + blue * blue * .068);
    }
}
