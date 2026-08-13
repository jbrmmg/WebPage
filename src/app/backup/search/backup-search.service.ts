import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BackupSearchRequest} from './backup-search-request';
import {BackupSearchResponse} from './backup-search-response';

@Injectable({
    providedIn: 'root'
})
export class BackupSearchService {
    constructor(private readonly http: HttpClient) {}

    private static handleError(err: HttpErrorResponse) {
        const msg = err.error instanceof ErrorEvent
            ? 'An error occurred'
            : `Server returned code ${err.status}: ${err.message}`;
        console.error('❌', msg);
        return throwError(() => msg);
    }

    search(request: BackupSearchRequest): Observable<BackupSearchResponse> {
        return this.http.post<BackupSearchResponse>(environment.backup.search, request).pipe(
            tap(data => console.log('📡 Search response:', JSON.stringify(data))),
            catchError(err => BackupSearchService.handleError(err))
        );
    }
}
