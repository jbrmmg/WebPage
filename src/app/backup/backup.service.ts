import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Action} from './backup-action';
import {ConfirmRequest} from './backup-confirmrequest';
import {HierarchyResponse} from './backup-hierarchyresponse';
import {FileInfoExtra} from './backup-fileinfoextra';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BackupService {
    readonly BACKUP_URL_ACTIONS = 'backup/actions';
    readonly BACKUP_URL_HIERARCHY = 'backup/hierarchy';

    readonly TEST_BACKUP_URL_ACTIONS = 'api/backup/actions.json';
    readonly TEST_BACKUP_URL_HIERARCHY = 'api/backup/hierarchy.json';
    readonly TEST_FILE_URL = 'api/backup/file.json';

    private static handleError(err: HttpErrorResponse) {
        let errorMessage;

        if (err.error instanceof ErrorEvent) {
            errorMessage = 'An error occurred: ';
        } else {
            errorMessage = `Server returned code ${err.status}, error message is ${err.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }

    constructor(private readonly http: HttpClient) {
    }

    getActions(): Observable<Action[]> {
        return this.http.get<Action[]>(environment.production === true ? this.BACKUP_URL_ACTIONS : this.TEST_BACKUP_URL_ACTIONS ).pipe(
            tap(data => console.log(`All: ${JSON.stringify(data)}`)),
            catchError( err => BackupService.handleError(err))
        );
    }

    getHierarchy(parent: HierarchyResponse): Observable<HierarchyResponse[]> {
        if (environment.production) {
            return this.http.post<HierarchyResponse[]>(this.BACKUP_URL_HIERARCHY, parent).pipe(
                tap(data => console.log(`All: ${JSON.stringify(data)}`)),
                catchError(err => BackupService.handleError(err))
            );
        } else {
            return this.http.get<HierarchyResponse[]>(this.TEST_BACKUP_URL_HIERARCHY).pipe(
                tap(data => console.log(`All: ${JSON.stringify(data)}`)),
                catchError(err => BackupService.handleError(err))
            );
        }
    }

    getFile(id: number): Observable<FileInfoExtra> {
        return this.http.get<FileInfoExtra>(environment.production === true ? `backup/file?id=${id}` : `api/backup/file${id}.json` ).pipe(
            tap(data => console.log(`All: ${JSON.stringify(data)}`)),
            catchError( err => BackupService.handleError(err))
        );
    }

    deleteFile(id: number) {
        this.http.delete<void>(`backup/file?id=${id}`).subscribe(() => {
                console.log('Delete File');
            },
            (response) => {
                console.log('DELETE call in error', response);
            },
            () => {
                console.log('The DELETE observable is now complete (delete file)');
            });
    }

    ignorePhoto(id: number) {
        const confirmReq = new ConfirmRequest();

        confirmReq.id = id;
        confirmReq.parameter = 'IGNORE';
        confirmReq.confirm = false;

        this.http.post<void>(this.BACKUP_URL_ACTIONS, confirmReq).subscribe(() => {
                console.log('Confirm Request');
            },
            (response) => {
                console.log('POST call in error (ignore)', response);
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

        this.http.post<void>(this.BACKUP_URL_ACTIONS, confirmReq).subscribe(() => {
                console.log('Confirm Request');
            },
            (response) => {
                console.log('POST call in error (keep)', response);
            },
            () => {
                console.log('The POST observable is now complete (keep photo)');
            });
    }

    imageUrl(id: number): string {
        if (environment.production) {
            return `backup/fileImage?id=${id}`;
        } else {
            return 'api/backup/test.image.jpg';
        }
    }

    videoUrl(id: number): string {
        if (environment.production) {
            return `backup/fileVideo?id=${id}`;
        } else {
            return 'api/backup/test.video.mp4';
        }
    }
}
