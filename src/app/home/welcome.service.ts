import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

export class ReminderRequest {
    what: string;
    detail: string;
}

@Injectable({
    providedIn: 'root'
})
export class WelcomeService {
    constructor(private http: HttpClient) {
    }

    SendData(text1:string, text2:string) {
        let request = new ReminderRequest();
        request.what = text1;
        request.detail = text2;

        this.http.post<void>("/podcast/reminder",request).subscribe(
            (val) => {
                console.log("POST call successful value returned in body", val)
            },
            (response) => {
                console.log("POST call in error", response);
            },
            () => {
                console.log("The POST observable is now complete (add)");
            }
        );
    }
}
