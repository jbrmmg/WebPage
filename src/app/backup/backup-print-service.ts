import {EventEmitter, Injectable, Output} from '@angular/core';
import {PrintSize, SelectedPrint} from './backup-selectedprint';
import {environment} from '../../environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BackupPrintService {
    private selectedPhoto: SelectedPrint;
    private selectedPhotos: SelectedPrint[];

    @Output() printsUpdated = new EventEmitter();

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

    getPrintSizes(): Observable<PrintSize[]> {
        return this.http.get<PrintSize[]>(environment.backupPrintSize).pipe(
            tap(data => console.log(`All: ${JSON.stringify(data)}`)),
            catchError(err => BackupPrintService.handleError(err))
        );
    }

    setSelectedPhoto(selected: number, name: string) {
        this.selectedPhoto = new SelectedPrint();
        this.selectedPhoto.fileId = selected;
        this.selectedPhoto.fileName = name;
        this.selectedPhoto.border = false;
        this.selectedPhoto.blackWhite = false;
    }

    getSelectedPhoto(): SelectedPrint {
        if (this.selectedPhoto == null) {
            return null;
        }

        return this.selectedPhoto;
    }

    selectForPrint() {
        this.http.post<void>(environment.backupPrint, this.selectedPhoto).subscribe({
            next: () => {
                console.log('Select for print');
            },
            error: (response) => {
                console.log('POST select for print', response);
            },
            complete: () => {
                this.updatePrints();
                console.log('POST select for print completed');
            }
        });
    }

    updatePrints() {
        this.http.get<SelectedPrint[]>(environment.backupPrints).subscribe({
            next: (selected) => {
                this.selectedPhotos = selected;
                console.log('Selecting from print');
            },
            error: (response) => {
                console.log('Selecting for print err', response);
            },
            complete: () => {
                this.printsUpdated.emit();
                console.log('loaded');
            }
        });
    }

    getSelectedPhotos(): SelectedPrint[] {
        return this.selectedPhotos;
    }

    unselectForPrint(id: number) {
        this.http.post<void>(environment.backupUnprint, id).subscribe({
            next: () => {
                console.log('Select for print');
            },
            error: (response) => {
                console.log('POST select for print', response);
            },
            complete: () => {
                this.updatePrints();
                console.log('POST unselect for print completed');
            }
        });
    }

    updatedPrint(print: SelectedPrint) {
        this.http.put<void>(environment.backupPrint, print).subscribe(
            {
                error: (response) => {
                    console.error('Failed to update file print size', response);
                },
                complete: () => {
                    this.updatePrints();
                }
            }
        );
    }

    clearPrints() {
        this.http.delete<void>(environment.backupPrints).subscribe({
            next: () => {
                console.log('Delete prints');
            },
            error: (response) => {
                console.log('DELETE prints', response);
            },
            complete: () => {
                this.updatePrints();
                console.log('The DELETE observable is now complete (delete prints)');
            }
        });
    }

    imageUrl(id: number): string {
        if (environment.production) {
            return `backup/files/image?id=${id}`;
        } else {
            return 'api/backup/test.image.jpg';
        }
    }
}
