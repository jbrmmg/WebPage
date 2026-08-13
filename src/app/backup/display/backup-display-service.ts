import {EventEmitter, Injectable, Output} from '@angular/core';
import {environment} from '../../../environments/environment';
import {FileInfoExtra} from '../backup-fileinfoextra';
import {HierarchyResponse} from '../backup-hierarchyresponse';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FileLabel, Label} from '../backup-label';
import {FileExpiry} from '../backup-expiry';
import {LatLong} from '../map/map-latlong';

@Injectable({
    providedIn: 'root'
})
export class BackupDisplayService {
    private selectedFile: FileInfoExtra;
    lastLocation: LatLong = null;

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
        console.error('❌', errorMessage);
        return throwError(() => new Error(errorMessage));
    }

    getHierarchy(parent: HierarchyResponse): Observable<HierarchyResponse[]> {
        return this.http.post<HierarchyResponse[]>(environment.backup.hierarchy, parent).pipe(
            tap(data => console.log('📡 Response:', JSON.stringify(data))),
            catchError(err => BackupDisplayService.handleError(err))
        );
    }

    imageUrl(id: number): string {
        if (environment.production) {
            return `backup/files/image?id=${id}`;
        } else {
            return 'api/backup/test.image.jpg';
        }
    }

    videoUrl(id: number): string {
        if (environment.production) {
            return `backup/files/video?id=${id}`;
        } else {
            return 'api/backup/test.video.mp4';
        }
    }

    getFile(id: number): void {
        this.http.get<FileInfoExtra>(environment.production === true ? `backup/files/detail?id=${id}` : `api/backup/file${id}.json` ).pipe(
            tap(data => console.log('📡 Response:', JSON.stringify(data))),
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
                console.log('✅ File loaded:', id);
            }
        });
    }

    deleteFile(id: number) {
        this.http.delete<void>(`backup/file?id=${id}`).subscribe({
            next: () => {
                console.log('🗑️ Delete File');
            },
            error: (response) => {
                console.error('❌ DELETE call in error', response);
            },
            complete: () => {
                console.log('✅ Delete file complete');
            }
        });
    }

    refreshFile(id: number) {
        this.http.post<FileInfoExtra>(environment.backup.files.refresh.replace('##id##', '' + id), '').pipe(
            tap(data => console.log('📡 Response:', JSON.stringify(data))),
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
                console.log('✅ File loaded:', id);
            }
        });
    }

    getLabels(): Observable<Label[]> {
        return this.http.get<Label[]>(environment.backup.labels).pipe(
            tap(data => console.log('📡 Response:', JSON.stringify(data))),
            catchError(err => BackupDisplayService.handleError(err))
        );
    }

    setFileLabel(id: number, labelId: number): void {
        let fileLabel: FileLabel;
        fileLabel = new FileLabel();
        fileLabel.fileId = id;
        fileLabel.labels = [];
        fileLabel.labels.push(labelId);

        this.http.post<FileInfoExtra>(environment.backup.labels, fileLabel).pipe(
            tap(data => console.log('📡 Response:', JSON.stringify(data))),
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
                console.log('✅ Label updated:', id);
            }
        });
    }

    removeFileLabel(id: number, labelId: number): void {
        let fileLabel: FileLabel;
        fileLabel = new FileLabel();
        fileLabel.fileId = id;
        fileLabel.labels = [];
        fileLabel.labels.push(labelId);

        this.http.delete<FileInfoExtra>(environment.backup.labels, {body: fileLabel}).pipe(
            tap(data => console.log('📡 Response:', JSON.stringify(data))),
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
                console.log('✅ Label updated:', id);
            }
        });
    }

    downloadFile(id: number, name: string): void {
        const url = environment.production
            ? `backup/files/download?id=${id}`
            : 'api/backup/test.image.jpg';

        this.http.get(url, {responseType: 'blob'}).subscribe({
            next: (blob) => {
                const objectUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = objectUrl;
                a.download = name;
                a.click();
                URL.revokeObjectURL(objectUrl);
            },
            error: (err) => console.error('❌ Download failed', err)
        });
    }

    updateFileLocation(id: number, lat: number, lng: number): void {
        const payload = {id, latitude: lat, longitude: lng};
        this.http.put<void>(environment.backup.files.location, payload).subscribe({
            next: () => console.log('📍 Location updated'),
            error: (err) => console.error('❌ Location update failed', err),
            complete: () => {
                this.lastLocation = new LatLong();
                this.lastLocation.lat = lat;
                this.lastLocation.long = lng;
                console.log('✅ Location updated:', id);
            }
        });
    }

    updateFileDate(id: number, date: Date): void {
        const payload = {id, date: date.toISOString()};
        this.http.put<void>(environment.backup.files.date, payload).subscribe({
            next: () => console.log('📅 Date updated'),
            error: (err) => console.error('❌ Date update failed', err),
            complete: () => console.log('✅ Date updated:', id)
        });
    }

    setFileExpiry(id: number, expiry: Date) {
        const fileExpiry: FileExpiry = new FileExpiry();
        fileExpiry.id = id;
        fileExpiry.expiry = expiry;

        this.http.put<FileInfoExtra>(environment.backup.files.expire, fileExpiry).pipe(
            tap(data => console.log('📡 Response:', JSON.stringify(data))),
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
                console.log('✅ File expiry set:', id);
            }
        });
    }
}
