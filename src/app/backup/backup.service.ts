import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Action} from './backup-action';
import {ConfirmRequest} from './backup-confirmrequest';
import {HierarchyResponse} from './backup-hierarchyresponse';
import {FileInfoExtra} from './backup-fileinfoextra';

@Injectable({
    providedIn: 'root'
})
export class BackupService {
    private static handleError(err: HttpErrorResponse) {
        let errorMessage;
        if (err.error instanceof ErrorEvent) {
            errorMessage = 'An error occurred: ';
        } else {
            errorMessage = 'Server returned code ' + err.status + ', error message is: ' + err.message;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }

    constructor(private http: HttpClient) {
    }

    getActions(): Observable<Action[]> {
        return this.http.get<Action[]>('backup/actions').pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError( err => BackupService.handleError(err))
        );
    }

    getHierarchy(parent: HierarchyResponse): Observable<HierarchyResponse[]> {
        return this.http.post<HierarchyResponse[]>('backup/hierarchy', parent).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError( err => BackupService.handleError(err))
        );
    }

    getFile(id: number): Observable<FileInfoExtra> {
        return this.http.get<FileInfoExtra>('backup/file?id=' + id).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError( err => BackupService.handleError(err))
        );
    }

    deleteFile(id: number) {
        this.http.delete<void>('backup/file?id=' + id).subscribe(() => {
                console.log('Delete File');
            },
            (response) => {
                console.log('POST call in error', response);
            },
            () => {
                console.log('The POST observable is now complete (delete file)');
            });
    }

    ignorePhoto(id: number) {
        const confirmReq = new ConfirmRequest();

        confirmReq.id = id;
        confirmReq.parameter = 'IGNORE';
        confirmReq.confirm = false;

        this.http.post<void>('backup/actions', confirmReq).subscribe(() => {
                console.log('Confirm Request');
            },
            (response) => {
                console.log('POST call in error', response);
            },
            () => {
                console.log('The POST observable is now complete (ignore photo)');
            });
    }

    keepPhoto(id: number, parameter: string) {
        const confirmReq = new ConfirmRequest();

        confirmReq.id = id;
        confirmReq.parameter = parameter;
        confirmReq.confirm = true;

        this.http.post<void>('backup/actions', confirmReq).subscribe(() => {
                console.log('Confirm Request');
            },
            (response) => {
                console.log('POST call in error', response);
            },
            () => {
                console.log('The POST observable is now complete (ignore photo)');
            });
    }
}
