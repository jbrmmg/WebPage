import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {ILogsType} from './logs-type';
import {ILogsData} from './logs-data';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LogsService {
    private typesUrl = 'api/logs/types.json';
    private dataUrl = 'api/logs/data.#TYPE#.json';

    private static handleError(err: HttpErrorResponse) {
        let errorMessage;
        if (err.error instanceof ErrorEvent) {
            errorMessage = 'An error occured: ';
        } else {
            errorMessage = 'Server returned code ' + err.status + ', error message is: ' + err.message;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }

    constructor(private http: HttpClient) {
        if (environment.production) {
            // Use production URL's
            this.typesUrl = '/log/type';
            this.dataUrl = '/log/data?date=#DATE#&type=#TYPE#';
        }
    }

    private getDataUrl(type: string, selectedDate: Date): string {
        let dateString: string;
        dateString = selectedDate.getFullYear().toString();
        dateString += ('0' + (selectedDate.getMonth() + 1).toString()).slice(-2);
        dateString += ('0' + selectedDate.getDate().toString()).slice(-2);
        // tslint:disable-next-line:no-console
        console.info(dateString + ' - ' + selectedDate.toLocaleDateString('en-GB'));
        return this.dataUrl.replace('#DATE#', dateString).replace('#TYPE#', type );
    }

    getLogsTypes(): Observable<ILogsType[]> {
        return this.http.get<ILogsType[]>(this.typesUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => LogsService.handleError(err))
        );
    }

    getLogsData(type: string, selectedDate: Date): Observable<ILogsData[]> {
        return this.http.get<ILogsData[]>(this.getDataUrl(type, selectedDate)).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => LogsService.handleError(err))
        );
    }
}
