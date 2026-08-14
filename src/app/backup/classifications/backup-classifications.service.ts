import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {BackupClassification} from './backup-classification';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BackupClassificationsService {
    constructor(private readonly http: HttpClient) {}

    private static handleError(err: HttpErrorResponse) {
        const msg = err.error instanceof ErrorEvent
            ? 'An error occurred'
            : `Server returned code ${err.status}, error message is ${err.message}`;
        console.error('❌', msg);
        return throwError(() => new Error(msg));
    }

    getClassifications(): Observable<BackupClassification[]> {
        return this.http.get<BackupClassification[]>(environment.backup.classifications).pipe(
            catchError(err => BackupClassificationsService.handleError(err))
        );
    }
}
