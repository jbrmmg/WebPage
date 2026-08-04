import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {BackupSummary} from './backup-summary';
import {environment} from '../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BackupSummaryService {
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
        return throwError(() => errorMessage);
    }

    getSummary(): Observable<BackupSummary> {
        return this.http.get<BackupSummary>(environment.backup.summary).pipe(
            tap(data => console.log('📡 Response:', JSON.stringify(data))),
            catchError(err => BackupSummaryService.handleError(err))
        );
    }
}
