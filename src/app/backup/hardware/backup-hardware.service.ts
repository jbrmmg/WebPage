import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {BackupHardware} from './backup-hardware';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BackupHardwareService {
    constructor(private readonly http: HttpClient) {}

    private static handleError(err: HttpErrorResponse) {
        const msg = err.error instanceof ErrorEvent
            ? 'An error occurred'
            : `Server returned code ${err.status}, error message is ${err.message}`;
        console.error('❌', msg);
        return throwError(() => new Error(msg));
    }

    getHardware(): Observable<BackupHardware[]> {
        return this.http.get<BackupHardware[]>(environment.backup.hardware).pipe(
            catchError(err => BackupHardwareService.handleError(err))
        );
    }
}
