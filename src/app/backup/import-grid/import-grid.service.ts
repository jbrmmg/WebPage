import {Observable, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ImportGridFile} from './import-grid-file';
import {catchError, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ListFilterType} from './import-grid-filter';
import {TrafficLightStatus, TrafficLightType} from './traffic/import-grid-traffic-light';
import {FileDestinationUpdate} from './import-grid-update-destination';

@Injectable({
    providedIn: 'root'
})
export class ImportGridService {
    constructor(private http: HttpClient) {
    }

    private static handleError(err: HttpErrorResponse) {
        let errorMessage: string;
        if (err.error instanceof ErrorEvent) {
            errorMessage = 'An error occurred (Import Grid Service): ';
        } else {
            errorMessage = 'Server returned code(Import Grid Service) ' + err.status + ', error message is: ' + err.message;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }

    getFiles(limit: number, page: number, filter: ListFilterType): Observable<ImportGridFile[]> {
        let url = environment.backupGetPreImportFiles + '?limit=' + limit + '&page=' + page;
        if (filter != null) {
            url = url + '&stepType=' + TrafficLightType[filter.type] + '&status=' + TrafficLightStatus[filter.status];
        }

        return this.http.get<ImportGridFile[]>(url).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => ImportGridService.handleError(err))
        );
    }

    fileUpdateSource(): EventSource {
        return new EventSource(environment.backupFileUpdates);
    }

    summaryUpdateSource(): EventSource {
        return new EventSource(environment.backupFileSummaryUpdates);
    }

    removeIgnored(): Observable<any> {
        return this.http.delete(environment.backupRemoveIgnored, { responseType: 'text' });
    }

    removeActive(): Observable<any> {
        return this.http.delete(environment.backupRemoveActive, { responseType: 'text' });
    }

    importPhotos(): Observable<any> {
        return this.http.post(environment.backupImportPhotos, '', {responseType: 'text'});
    }

    removeConfirmedImports(): Observable<any> {
        return this.http.delete(environment.backupDeleteConfirmedImports, {responseType: 'text'});
    }

    ignore(file: string): Observable<any> {
        return this.http.post(environment.backupIgnoreFile, file, {responseType: 'text'});
    }

    delete(file: string): Observable<any> {
        return this.http.delete(environment.backupDeleteImportFile, {body: file});
    }

    unignore(file: string): Observable<any> {
        return this.http.post(environment.backupUnignoreFile, file, {responseType: 'text'});
    }

    recipe(file: string): Observable<any> {
        return this.http.post(environment.backupRecipeFile, file, {responseType: 'text'});
    }

    backup(file: string): Observable<any> {
        return this.http.post(environment.basicBackupFile, file, {responseType: 'text'});
    }

    updateDestination(update: FileDestinationUpdate): Observable<any> {
        return this.http.post(environment.backupUpdateDestination, update, {responseType: 'text'});
    }
}
