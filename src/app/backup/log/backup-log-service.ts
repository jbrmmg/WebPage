import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Log} from '../backup-log';
import {environment} from '../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BackupLogService {
    constructor(private readonly http: HttpClient) {
    }

    private static handleError(err: HttpErrorResponse) {
        let errorMessage: string;

        if (err.error instanceof ErrorEvent) {
            errorMessage = 'An error occurred: ';
        } else {
            errorMessage = `Server returned code ${err.status}, error message is ${err.message}`;
        }
        console.error('❌', errorMessage);
        return throwError(() => new Error(errorMessage));
    }

    getLogs(): Observable<Log[]> {
        return this.http.get<Log[]>(environment.backupLog).pipe(
            tap(data => console.log('📡 Response:', JSON.stringify(data))),
            catchError(err => BackupLogService.handleError(err))
        );
    }
}
