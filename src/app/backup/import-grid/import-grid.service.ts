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
    constructor(private readonly http: HttpClient) {
    }

    private static handleError(err: HttpErrorResponse) {
        let errorMessage: string;
        if (err.error instanceof ErrorEvent) {
            errorMessage = 'An error occurred (Import Grid Service): ';
        } else {
            errorMessage = 'Server returned code(Import Grid Service) ' + err.status + ', error message is: ' + err.message;
        }
        console.error('❌', errorMessage);
        return throwError(() => new Error(errorMessage));
    }

    getFiles(limit: number, page: number, filter: ListFilterType): Observable<ImportGridFile[]> {
        let url = environment.backup.import.files + '?limit=' + limit + '&page=' + page;
        if (filter != null) {
            url = url + '&stepType=' + TrafficLightType[filter.type] + '&status=' + TrafficLightStatus[filter.status];
        }

        return this.http.get<ImportGridFile[]>(url).pipe(
            tap(data => console.log('📡 Response:', JSON.stringify(data))),
            catchError(err => ImportGridService.handleError(err))
        );
    }

    fileUpdateSource(): EventSource {
        return new EventSource(environment.backup.import.fileUpdates);
    }

    summaryUpdateSource(): EventSource {
        return new EventSource(environment.backup.import.summaryUpdates);
    }

    removeIgnored(): Observable<any> {
        return this.http.delete(environment.backup.import.ignored, { responseType: 'text' });
    }

    removeActive(): Observable<any> {
        return this.http.delete(environment.backup.import.activePhotos, { responseType: 'text' });
    }

    importPhotos(): Observable<any> {
        return this.http.post(environment.backup.import.photos, '', {responseType: 'text'});
    }

    removeConfirmedImports(): Observable<any> {
        return this.http.delete(environment.backup.import.confirmed, {responseType: 'text'});
    }

    ignore(file: string): Observable<any> {
        return this.http.post(environment.backup.import.file.ignore, file, {responseType: 'text'});
    }

    delete(file: string): Observable<any> {
        return this.http.delete(environment.backup.import.file.delete, {body: file});
    }

    unignore(file: string): Observable<any> {
        return this.http.post(environment.backup.import.file.unIgnore, file, {responseType: 'text'});
    }

    recipe(file: string): Observable<any> {
        return this.http.post(environment.backup.import.file.recipe, file, {responseType: 'text'});
    }

    backup(file: string): Observable<any> {
        return this.http.post(environment.backup.import.file.backup, file, {responseType: 'text'});
    }

    updateDestination(update: FileDestinationUpdate): Observable<any> {
        return this.http.post(environment.backup.import.file.destination, update, {responseType: 'text'});
    }
}
