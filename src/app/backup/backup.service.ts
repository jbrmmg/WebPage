import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Log} from './backup-log'
import {FileInfoExtra} from './backup-fileinfoextra';
import {environment} from '../../environments/environment';
import {FileExpiry} from "./backup-expiry";
import {FileLabel, Label} from "./backup-label";
import {SelectedPrint} from "./backup-selectedprint";

@Injectable({
    providedIn: 'root'
})
export class BackupService {
    readonly BACKUP_URL_LOGS = 'backup/log';
    readonly BACKUP_URL_PRINTS = 'backup/prints';
    readonly BACKUP_URL_UNPRINT = 'backup/unprint';
    readonly BACKUP_URL_LABELS = 'backup/labels';
    readonly BACKUP_URL_PRINT_SIZE_UPDATE = 'backup/print';

    readonly TEST_BACKUP_URL_LOGS = 'api/backup/logs.json';
    readonly TEST_BACKUP_URL_PRINTS = 'api/backup/prints.json';
    readonly TEST_BACKUP_URL_LABELS = 'api/backup/labels.json';

    private selectedPhotos: SelectedPrint[];
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

    getLogs(): Observable<Log[]> {
        return this.http.get<Log[]>(environment.production === true ? this.BACKUP_URL_LOGS : this.TEST_BACKUP_URL_LOGS).pipe(
            tap(data => console.log(`All: ${JSON.stringify(data)}`)),
            catchError(err => BackupService.handleError(err))
        );
    }

    getLabels() : Observable<Label[]> {
        return this.http.get<Label[]>(environment.production === true ? this.BACKUP_URL_LABELS : this.TEST_BACKUP_URL_LABELS).pipe(
            tap(data=> console.log(`All: ${JSON.stringify(data)}`)),
            catchError(err => BackupService.handleError(err))
        );
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

    imageUrl(id: number): string {
        if (environment.production) {
            return `backup/fileImage?id=${id}`;
        } else {
            return 'api/backup/test.image.jpg';
        }
    }

    getSelectedPhotos():SelectedPrint[] {
        return this.selectedPhotos;
    }

    updatePrints() {
        this.http.get<SelectedPrint[]>(environment.production === true ? this.BACKUP_URL_PRINTS : this.TEST_BACKUP_URL_PRINTS).subscribe(
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

    updatedPrint(print: SelectedPrint) {
        this.http.put<void>(this.BACKUP_URL_PRINT_SIZE_UPDATE,print).subscribe(
            {
                error: (response) => {
                    console.error('Failed to update file print size', response)
                },
                complete: () => {
                    this.updatePrints();
                }
            }
        )
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
