import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {Action} from "./backup-action";
import {environment} from "../../environments/environment";

export class ConfirmRequest {
    id: number;
    parameter: string;
}

export class HierarchyResponse {
    id: number;
    level: number;
    displayName: string;
    path: string;
    directory: boolean;
    underlyingId: number;
}

export class FileInfo {
    id: number;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class BackupService {
    constructor(private http: HttpClient) {
    }

    getActions(): Observable<Action[]> {
        return this.http.get<Action[]>("backup/actions").pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError( err => BackupService.handleError(err))
        );
    }

    getHierarchy(parent: HierarchyResponse): Observable<HierarchyResponse[]> {
        return this.http.post<HierarchyResponse[]>("backup/hierarchy",parent).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError( err => BackupService.handleError(err))
        );
    }

    getFile(id: number): Observable<FileInfo> {
        return this.http.get<FileInfo>("backup/file?id=" + id).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError( err => BackupService.handleError(err))
        );
    }

    private static handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if(err.error instanceof ErrorEvent) {
            errorMessage = 'An error occured: ';
        } else {
            errorMessage = 'Server returned code ' + err.status + ', error message is: ' + err.message;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }

    getCustomerImages(id: number): Observable<File> {
        let result: Observable<any> = this.http
            .get(`backup/action-image?actionId=` + id, { responseType: "blob" });
        return result;
    }

    getFileImage(id: number): Observable<File> {
        let result: Observable<any> = this.http
            .get('backup/fileImage?id=' + id, { responseType: "blob" });
        return result;
    }

    ignorePhoto(id: number) {
        let confirmReq = new ConfirmRequest();

        confirmReq.id = id;
        confirmReq.parameter = "IGNORE";

        this.http.post<void>("backup/actions",confirmReq).subscribe(() => {
                console.log("Confirm Request");
            },
            (response) => {
                console.log("POST call in error", response);
            },
            () => {
                console.log("The POST observable is now complete (ignore photo)");
            });
    }

    keepPhoto(id: number) {
        let confirmReq = new ConfirmRequest();

        confirmReq.id = id;
        confirmReq.parameter = "";

        this.http.post<void>("backup/actions",confirmReq).subscribe(() => {
                console.log("Confirm Request");
            },
            (response) => {
                console.log("POST call in error", response);
            },
            () => {
                console.log("The POST observable is now complete (ignore photo)");
            });
    }
}
