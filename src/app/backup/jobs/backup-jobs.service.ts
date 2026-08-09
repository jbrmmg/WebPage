import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {BackupJob} from '../backup-job';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BackupJobsService {
    constructor(private readonly http: HttpClient) {}

    private static handleError(err: HttpErrorResponse) {
        const msg = err.error instanceof ErrorEvent
            ? 'An error occurred'
            : `Server returned code ${err.status}, error message is ${err.message}`;
        console.error('❌', msg);
        return throwError(() => new Error(msg));
    }

    getJobs(): Observable<BackupJob[]> {
        return this.http.get<BackupJob[]>(environment.backup.jobs).pipe(
            catchError(err => BackupJobsService.handleError(err))
        );
    }
}
