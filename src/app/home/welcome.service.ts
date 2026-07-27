import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export class ReminderRequest {
    what: string;
    detail: string;
}

@Injectable({
    providedIn: 'root'
})
export class WelcomeService {
    constructor(private readonly http: HttpClient) {
    }

    SendData(text1: string, text2: string) {
        const request = new ReminderRequest();
        request.what = text1;
        request.detail = text2;

        this.http.post<void>('/podcast/reminder', request).subscribe({
            next: (val) => {
                console.log('✅ POST call successful', val);
            },
            error: (response) => {
                console.error('❌ POST call in error', response);
            }
        });
    }

    getVersion(): Observable<{version: string}> {
        return this.http.get<{version: string}>('/api/util/version.json');
    }
}
