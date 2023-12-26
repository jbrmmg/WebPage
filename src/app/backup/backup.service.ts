import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Action} from './backup-action';
import {Log} from './backup-log'
import {ConfirmRequest} from './backup-confirmrequest';
import {HierarchyResponse} from './backup-hierarchyresponse';
import {FileInfoExtra} from './backup-fileinfoextra';
import {environment} from '../../environments/environment';
import {BackupSummary} from "./summary/backup-summary";
import {FileExpiry} from "./backup-expiry";
import {FileLabel, Label} from "./backup-label";

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
    readonly BACKUP_URL_LOGS = 'backup/log';
    readonly BACKUP_URL_PRINTS = 'backup/prints';
    readonly BACKUP_URL_PRINT = 'backup/print';
    readonly BACKUP_URL_UNPRINT = 'backup/unprint';
    readonly BACKUP_URL_LABELS = 'backup/labels';

    readonly TEST_BACKUP_URL_SUMMARY = 'api/backup/summary.json';
    readonly TEST_BACKUP_URL_ACTIONS = 'api/backup/actions.json';
    readonly TEST_BACKUP_URL_CONF_ACTIONS = 'api/backup/conf-actions.json';
    readonly TEST_BACKUP_URL_HIERARCHY = 'api/backup/hierarchy.json';
    readonly TEST_BACKUP_URL_LOGS = 'api/backup/logs.json';
    readonly TEST_BACKUP_URL_PRINTS = 'api/backup/prints.json';
    readonly TEST_BACKUP_URL_LABELS = 'api/backup/labels.json';

    private selectedPhoto : number;

    private selectedPhotos: number[];
    private selectedFile: FileInfoExtra;
    @Output() printsUpdated = new EventEmitter();
    @Output() fileLoaded : EventEmitter<FileInfoExtra> = new EventEmitter<FileInfoExtra>();

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

    getLogs(): Observable<Log[]> {
        return this.http.get<Log[]>(environment.production === true ? this.BACKUP_URL_LOGS : this.TEST_BACKUP_URL_LOGS).pipe(
            tap(data => console.log(`All: ${JSON.stringify(data)}`)),
            catchError(err => BackupService.handleError(err))
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

    getLabels() : Observable<Label[]> {
        return this.http.get<Label[]>(environment.production === true ? this.BACKUP_URL_LABELS : this.TEST_BACKUP_URL_LABELS).pipe(
            tap(data=> console.log(`All: ${JSON.stringify(data)}`)),
            catchError(err => BackupService.handleError(err))
        );
    }

    /*
     * -----------------------------------------------------------------------------------------------------------------------------------
     * Selected File - request file, get details of selected file.
     */
    getFile(id: number): void {
        this.http.get<FileInfoExtra>(environment.production === true ? `backup/file?id=${id}` : `api/backup/file${id}.json` ).pipe(
            tap(data => console.log(`All: ${JSON.stringify(data)}`)),
            catchError( err => BackupService.handleError(err))
        ).subscribe({
            next:(nextFile: FileInfoExtra) => {
                this.fileLoaded.emit(nextFile);
                this.selectedFile = nextFile;
            },
            error: (response) => {
                console.error('Failed to get file information.', response)
            },
            complete: () => {
                console.log('File loaded ' + id);
            }
        });
    }

    setFileLabel(id: number, labelId: number): void {
        let fileLabel : FileLabel;
        fileLabel = new FileLabel();
        fileLabel.fileId = id;
        fileLabel.labels = [];
        fileLabel.labels.push(labelId);

        this.http.post<FileInfoExtra>(environment.production === true ? 'backup/label' : 'api/backup/label.json', fileLabel).pipe(
            tap(data => console.log(`All: ${JSON.stringify(data)}`)),
            catchError(err => BackupService.handleError(err))
        ).subscribe({
            next:(nextFile: FileInfoExtra) => {
                this.fileLoaded.emit(nextFile);
                this.selectedFile = nextFile;
            },
            error: (response) => {
                console.error('Failed to update file label', response)
            },
            complete: () => {
                console.log('Label updated ' + id);
            }
        });
    }

    removeFileLabel(id: number, labelId: number): void {
        let fileLabel : FileLabel;
        fileLabel = new FileLabel();
        fileLabel.fileId = id;
        fileLabel.labels = [];
        fileLabel.labels.push(labelId);

        this.http.delete<FileInfoExtra>(environment.production === true ? 'backup/label' : 'api/backup/label.json', {body: fileLabel}).pipe(
            tap(data => console.log(`All: ${JSON.stringify(data)}`)),
            catchError(err => BackupService.handleError(err))
        ).subscribe({
            next:(nextFile: FileInfoExtra) => {
                this.fileLoaded.emit(nextFile);
                this.selectedFile = nextFile;
            },
            error: (response) => {
                console.error('Failed to update file label', response)
            },
            complete: () => {
                console.log('Label updated ' + id);
            }
        });
    }

    fileHasBeenSelected(): boolean {
        return this.selectedFile != null;
    }

    getSelectedFile(): FileInfoExtra {
        return this.selectedFile;
    }

    /*
     * -----------------------------------------------------------------------------------------------------------------------------------
     * File Expiry
     */

    setFileExpiry(id: number, expiry: Date) {
        let fileExpiry: FileExpiry = new FileExpiry();
        fileExpiry.id = id;
        fileExpiry.expiry = expiry;

        this.http.put<FileInfoExtra>(environment.production === true ? `backup/expire` : `api/backup/file${id}.json`,fileExpiry).pipe(
            tap(data => console.log(`All: ${JSON.stringify(data)}`)),
            catchError( err => BackupService.handleError(err))
        ).subscribe({
            next:(nextFile: FileInfoExtra) => {
                this.fileLoaded.emit(nextFile);
                this.selectedFile = nextFile;
            },
            error: (response) => {
                console.error('Failed to expire file.', response)
            },
            complete: () => {
                console.log('File loaded (expire)' + id);
            }
        });
    }

    clearFileExpiry(id: number) {

    }

    /*
     * -----------------------------------------------------------------------------------------------------------------------------------
     * Selected File - request file, get details of selected file.
     */

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

    convert() {
        this.http.post<void>(this.BACKUP_URL_CONVERT_FILES,"").subscribe(() => {
                console.log('Reset Import Files');
            },
            (response) => {
                console.log('PUT call in error (convert files)', response);
            },
            () => {
                console.log('The PUT observable is now complete (convert files)');
            });
    }

    importFiles() {
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

    setSelectedPhoto(selected: number) {
        this.selectedPhoto = selected;
    }

    getSelectedPhoto():number {
        return this.selectedPhoto;
    }

    getSelectedPhotos():number[] {
        return this.selectedPhotos;
    }

    updatePrints() {
        this.http.get<number[]>(environment.production === true ? this.BACKUP_URL_PRINTS : this.TEST_BACKUP_URL_PRINTS).subscribe(
            (selected) => {
                this.selectedPhotos = selected;
                console.log('Selecting from print');
            },
            (response) => {
                console.log('Selecting for print err', response);
            },
            () => {
                this.printsUpdated.emit();
                console.log('loaded');
            }
        );
    }

    selectForPrint() {
        this.http.post<void>(this.BACKUP_URL_PRINT,this.selectedPhoto).subscribe(() => {
                console.log('Select for print');
            },
            (response) => {
                console.log('POST select for print', response);
            },
            () => {
                this.updatePrints();
                console.log('POST select for print completed');
            });
    }

    unselectForPrint(id: number) {
        this.http.post<void>(this.BACKUP_URL_UNPRINT,id).subscribe(() => {
                console.log('Select for print');
            },
            (response) => {
                console.log('POST select for print', response);
            },
            () => {
                this.updatePrints();
                console.log('POST select for print completed');
            });
    }

    clearPrints() {
        this.http.delete<void>(environment.production === true ? this.BACKUP_URL_PRINTS : this.TEST_BACKUP_URL_PRINTS).subscribe(() => {
                console.log('Delete prints');
            },
            (response) => {
                console.log('DELETE prints', response);
            },
            () => {
                this.updatePrints();
                console.log('The DELETE observable is now complete (delete prints)');
            });
    }
}
