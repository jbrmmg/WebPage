import {EventEmitter, Injectable, Output} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {IPodcastEpisode} from "./podcast-episode";
import {IPodcast} from "./podcast-podcast";
import {environment} from "../../environments/environment";

export class StatusResponse {
    status: string;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class PodcastService {
    private readonly podcastUrl;
    private readonly episodeUrl;

    constructor(private http: HttpClient) {
        if(environment.production) {
            // Use production URL's
            this.podcastUrl = '/podcast/type';
            this.episodeUrl = '/podcast/episode?podcastId=#ID#';
        } else {
            this.podcastUrl = 'api/podcast/types.json';
            this.episodeUrl = 'api/podcast/episode.json';
        }

    }

    private getEpisodeUrl(id: string) : string {
        return this.episodeUrl.replace("#ID#",id);
    }

    getPodcasts(): Observable<IPodcast[]> {
        return this.http.get<IPodcast[]>(this.podcastUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => PodcastService.handleError(err))
        );
    }

    getEpisodes(id: string): Observable<IPodcastEpisode[]> {
        return this.http.get<IPodcastEpisode[]>(this.getEpisodeUrl(id)).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(err => PodcastService.handleError(err))
        );
    }

    deleteEpisode(id: string)
    {
        console.info("Delete episode - " + id + " " + this.episodeUrl);

        let url: string;
        url = this.episodeUrl;
        url = url.replace("#ID#",id);

        this.http.delete<StatusResponse>(url).subscribe(
            (val) => {
                console.log("POST call successful value returned in body - " + val.status + " " + val.message);
                this.episodeDeleted.emit();
            },
            (response) => {
                console.log("POST call in error", response);
                this.episodeDeleted.emit();
            },
            () => {
                console.log("The POST observable is now complete");
                this.episodeDeleted.emit();
            }
        );
    }

    @Output() episodeDeleted : EventEmitter<void> = new EventEmitter<void>();

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

}
