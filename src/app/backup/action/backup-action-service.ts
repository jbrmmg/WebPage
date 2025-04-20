import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {Action} from "./backup-action";
import {ConfirmRequest} from "../backup-confirmrequest";
@Injectable({
    providedIn: 'root'
})
export class BackupActionService {
    constructor(private http: HttpClient) {
    }

    private static handleError(err: HttpErrorResponse) {
        let errorMessage: string;
        if (err.error instanceof ErrorEvent) {
            errorMessage = 'An error occurred (Backup Action Service): ';
        } else {
            errorMessage = 'Server returned code (Backup Action Service) ' + err.status + ', error message is: ' + err.message;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }

    getActions(): Observable<Action[]> {
        return this.http.get<Action[]>(environment.backupActions).pipe(
            tap(data => console.log(`All: ${JSON.stringify(data)}`)),
            catchError( err => BackupActionService.handleError(err))
        );
    }

    confirmRequest(id: number) {
        const confirmReq = new ConfirmRequest();

        confirmReq.id = id;
        confirmReq.confirm = true;

        // Send the confirmation request to the server.
        this.http.post<void>(environment.backupActions, confirmReq).subscribe({
            error: err => {
                console.log("Failed to confirm the request " + err);
            },
            complete: () => {
                console.log("Request is confirmed");
            }
        });
    }
}
