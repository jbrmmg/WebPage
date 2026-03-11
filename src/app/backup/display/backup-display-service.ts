import {EventEmitter, Injectable, Output} from '@angular/core';
import {environment} from '../../../environments/environment';
import {FileInfoExtra} from '../backup-fileinfoextra';
import {HierarchyResponse} from '../backup-hierarchyresponse';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FileLabel, Label} from '../backup-label';
import {FileExpiry} from '../backup-expiry';

@Injectable({
    providedIn: 'root'
})
export class BackupDisplayService {
    private selectedFile: FileInfoExtra;

    @Output() fileLoaded: EventEmitter<FileInfoExtra> = new EventEmitter<FileInfoExtra>();

    constructor(private readonly http: HttpClient) {
    }

    private static handleError(err: HttpErrorResponse) {
        let errorMessage: string;

        if (err.error instanceof ErrorEvent) {
            errorMessage = 'An error occurred: ';
        } else {
            errorMessage = `Server returned code ${err.status}, error message is ${err.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }

    getHierarchy(parent: HierarchyResponse): Observable<HierarchyResponse[]> {
        return this.http.post<HierarchyResponse[]>(environment.backupHierarchy, parent).pipe(
            tap(data => console.log(`All: ${JSON.stringify(data)}`)),
            catchError(err => BackupDisplayService.handleError(err))
        );
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

    getFile(id: number): void {
        this.http.get<FileInfoExtra>(environment.production === true ? `backup/file?id=${id}` : `api/backup/file${id}.json` ).pipe(
            tap(data => console.log(`All: ${JSON.stringify(data)}`)),
            catchError( err => BackupDisplayService.handleError(err))
        ).subscribe({
            next: (nextFile: FileInfoExtra) => {
                this.fileLoaded.emit(nextFile);
                this.selectedFile = nextFile;
            },
            error: (response) => {
                console.error('Failed to get file information.', response);
            },
            complete: () => {
                console.log('File loaded ' + id);
            }
        });
    }

    deleteFile(id: number) {
        this.http.delete<void>(`backup/file?id=${id}`).subscribe({
            next: () => {
                console.log('Delete File');
            },
            error: (response) => {
                console.log('DELETE call in error', response);
            },
            complete: () => {
                console.log('The DELETE observable is now complete (delete file)');
            }
        });
    }

    refreshFile(id: number) {
        this.http.post<FileInfoExtra>(environment.backupRefreshFile.replace('##id##', '' + id), '').pipe(
            tap(data => console.log(`All: ${JSON.stringify(data)}`)),
            catchError( err => BackupDisplayService.handleError(err))
        ).subscribe({
            next: (nextFile: FileInfoExtra) => {
                this.fileLoaded.emit(nextFile);
                this.selectedFile = nextFile;
            },
            error: (response) => {
                console.error('Failed to get file information.', response);
            },
            complete: () => {
                console.log('File loaded ' + id);
            }
        });
    }

    getLabels(): Observable<Label[]> {
        return this.http.get<Label[]>(environment.backupLabels).pipe(
            tap(data => console.log(`All: ${JSON.stringify(data)}`)),
            catchError(err => BackupDisplayService.handleError(err))
        );
    }

    setFileLabel(id: number, labelId: number): void {
        let fileLabel: FileLabel;
        fileLabel = new FileLabel();
        fileLabel.fileId = id;
        fileLabel.labels = [];
        fileLabel.labels.push(labelId);

        this.http.post<FileInfoExtra>(environment.backupLabel, fileLabel).pipe(
            tap(data => console.log(`All: ${JSON.stringify(data)}`)),
            catchError(err => BackupDisplayService.handleError(err))
        ).subscribe({
            next: (nextFile: FileInfoExtra) => {
                this.fileLoaded.emit(nextFile);
                this.selectedFile = nextFile;
            },
            error: (response) => {
                console.error('Failed to update file label', response);
            },
            complete: () => {
                console.log('Label updated ' + id);
            }
        });
    }

    removeFileLabel(id: number, labelId: number): void {
        let fileLabel: FileLabel;
        fileLabel = new FileLabel();
        fileLabel.fileId = id;
        fileLabel.labels = [];
        fileLabel.labels.push(labelId);

        this.http.delete<FileInfoExtra>(environment.backupLabel, {body: fileLabel}).pipe(
            tap(data => console.log(`All: ${JSON.stringify(data)}`)),
            catchError(err => BackupDisplayService.handleError(err))
        ).subscribe({
            next: (nextFile: FileInfoExtra) => {
                this.fileLoaded.emit(nextFile);
                this.selectedFile = nextFile;
            },
            error: (response) => {
                console.error('Failed to update file label', response);
            },
            complete: () => {
                console.log('Label updated ' + id);
            }
        });
    }

    setFileExpiry(id: number, expiry: Date) {
        const fileExpiry: FileExpiry = new FileExpiry();
        fileExpiry.id = id;
        fileExpiry.expiry = expiry;

        this.http.put<FileInfoExtra>(environment.backupExpire, fileExpiry).pipe(
            tap(data => console.log(`All: ${JSON.stringify(data)}`)),
            catchError( err => BackupDisplayService.handleError(err))
        ).subscribe({
            next: (nextFile: FileInfoExtra) => {
                this.fileLoaded.emit(nextFile);
                this.selectedFile = nextFile;
            },
            error: (response) => {
                console.error('Failed to expire file.', response);
            },
            complete: () => {
                console.log('File loaded (expire)' + id);
            }
        });
    }
}
