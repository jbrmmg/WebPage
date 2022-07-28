import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Action} from './backup-action';
import {ConfirmRequest} from './backup-confirmrequest';
import {HierarchyResponse} from './backup-hierarchyresponse';
import {FileInfoExtra} from './backup-fileinfoextra';
import {environment} from '../../environments/environment';
import {BackupSummary} from "./summary/backup-summary";

@Injectable({
    providedIn: 'root'
})
export class BackupService {
    readonly BACKUP_URL_SUMMARY = 'backup/summary';
    readonly BACKUP_URL_ACTIONS = 'backup/actions';
    readonly BACKUP_URL_CONF_ACTIONS = 'backup/confirmed-actions';
    readonly BACKUP_URL_HIERARCHY = 'backup/hierarchy';
    readonly BACKUP_URL_RESET_IMPORT = 'backup/importfiles';
    readonly BACKUP_URL_PROCESS_IMPORT = 'backup/importprocess';
    readonly BACKUP_URL_IMPORT_FILES = 'backup/import';
    readonly BACKUP_URL_CONVERT_FILES = 'backup/convert';

    readonly TEST_BACKUP_URL_SUMMARY = 'api/backup/summary.json';
    readonly TEST_BACKUP_URL_ACTIONS = 'api/backup/actions.json';
    readonly TEST_BACKUP_URL_CONF_ACTIONS = 'api/backup/conf-actions.json';
    readonly TEST_BACKUP_URL_HIERARCHY = 'api/backup/hierarchy.json';

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

    getConfirmedActions(): Observable<Action[]> {
        return this.http.get<Action[]>(environment.production === true ? this.BACKUP_URL_CONF_ACTIONS : this.TEST_BACKUP_URL_CONF_ACTIONS ).pipe(
            tap(data => console.log(`All: ${JSON.stringify(data)}`)),
            catchError( err => BackupService.handleError(err))
        );
    }

    getSummary() : Observable<BackupSummary> {
        return this.http.get<BackupSummary>(environment.production === true ? this.BACKUP_URL_SUMMARY : this.TEST_BACKUP_URL_SUMMARY).pipe(
            tap(data =>  console.log(`All: ${JSON.stringify(data)}`)),
            catchError(err => BackupService.handleError(err))
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

    confirmRequest(id: number) {
        const confirmReq = new ConfirmRequest();

        confirmReq.id = id;
        confirmReq.confirm = true;

        this.http.post<void>(this.BACKUP_URL_ACTIONS, confirmReq).subscribe(() => {
                console.log('Confirm Request');
            },
            (response) => {
                console.log('POST call in error (confirm)', response);
            },
            () => {
                console.log('The POST observable is now complete (confirm)');
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

    recipePhoto(id: number) {
        const confirmReq = new ConfirmRequest();

        confirmReq.id = id;
        confirmReq.parameter = '<recipe>';
        confirmReq.confirm = false;

        this.http.post<void>(this.BACKUP_URL_ACTIONS, confirmReq).subscribe(() => {
                console.log('Confirm Request');
            },
            (response) => {
                console.log('POST call in error (recipe)', response);
            },
            () => {
                console.log('The POST observable is now complete (recipe photo)');
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

    resetImportFiles() {
        this.http.put<void>(this.BACKUP_URL_RESET_IMPORT,"").subscribe(() => {
                console.log('Reset Import Files');
            },
            (response) => {
                console.log('PUT call in error (reset files)', response);
            },
            () => {
                console.log('The PUT observable is now complete (reset files)');
            });
    }

    processImport() {
        this.http.post<void>(this.BACKUP_URL_PROCESS_IMPORT,"").subscribe(() => {
                console.log('Reset Import Files');
            },
            (response) => {
                console.log('PUT call in error (reset files)', response);
            },
            () => {
                console.log('The PUT observable is now complete (reset files)');
            });
    }

    importFiles(directory: string) {
        this.http.post<void>(this.BACKUP_URL_IMPORT_FILES,"").subscribe(() => {
                console.log('Reset Import Files');
            },
            (response) => {
                console.log('PUT call in error (reset files)', response);
            },
            () => {
                console.log('The PUT observable is now complete (reset files)');
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

    convert() {
        if (environment.production) {
            return this.http.post<HierarchyResponse[]>(this.BACKUP_URL_CONVERT_FILES, parent).pipe(
                tap(data => console.log(`All: ${JSON.stringify(data)}`)),
                catchError(err => BackupService.handleError(err))
            );
        }
    }

    doImport() {
        if (environment.production) {
            return this.http.post<HierarchyResponse[]>(this.BACKUP_URL_IMPORT_FILES, parent).pipe(
                tap(data => console.log(`All: ${JSON.stringify(data)}`)),
                catchError(err => BackupService.handleError(err))
            );
        }
    }

    process() {
        if (environment.production) {
            return this.http.post<HierarchyResponse[]>(this.BACKUP_URL_PROCESS_IMPORT, parent).pipe(
                tap(data => console.log(`All: ${JSON.stringify(data)}`)),
                catchError(err => BackupService.handleError(err))
            );
        }
    }
}
