import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {BackupSummary} from './backup-summary';
import {environment} from '../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';

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

    runSync(syncId: number): Observable<void> {
        const params = new HttpParams().set('syncId', syncId);
        return this.http.post<void>(environment.backup.syncRun, null, { params }).pipe(
            catchError(err => BackupSummaryService.handleError(err))
        );
    }

    gather(sourceId: number): Observable<void> {
        const params = new HttpParams().set('sourceId', sourceId);
        return this.http.post<void>(environment.backup.gather, null, { params }).pipe(
            catchError(err => BackupSummaryService.handleError(err))
        );
    }

    getSummary(): Observable<BackupSummary> {
        return this.http.get<BackupSummary>(environment.backup.summary).pipe(
            tap(data => console.log('📡 Response:', JSON.stringify(data))),
            catchError(err => BackupSummaryService.handleError(err))
        );
    }
}
