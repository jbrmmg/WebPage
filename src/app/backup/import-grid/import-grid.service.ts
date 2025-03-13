import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ImportGridFile} from "./import-grid-file";
import {catchError, tap} from "rxjs/operators";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ImportGridService {
    constructor(private http: HttpClient) {
    }

    private static handleError(err: HttpErrorResponse) {
        let errorMessage: string;
        if (err.error instanceof ErrorEvent) {
            errorMessage = 'An error occurred: ';
        } else {
            errorMessage = 'Server returned code ' + err.status + ', error message is: ' + err.message;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }

    getFiles(): Observable<ImportGridFile[]> {
        return this.http.get<ImportGridFile[]>(environment.backupGetPreImportFiles).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => ImportGridService.handleError(err))
        );
    }

    deletePreImportFile(filename: string): Observable<any> {
        console.log("Delete file " + filename);
        console.log("Delete file " + environment.backupDeletePreImportFile);
        return this.http.delete(environment.backupDeletePreImportFile, {body: filename, responseType: 'text'});
    }
}
