import {Component, OnInit} from "@angular/core";
import {IPodcastEpisode} from "./podcast-episode";
import {PodcastService} from "./podcast.service";
import {IPodcast} from "./podcast-podcast";

@Component({
    templateUrl: './podcast.component.html',
    styleUrls: ['./podcast.component.css']
})
export class PodcastComponent implements OnInit {
    selectedId: string;
    errorMessage: string;
    selectedPodcast: string;

    podcasts: IPodcast[];
    episodes: IPodcastEpisode[];

    constructor(private _podcastService: PodcastService) {
        _podcastService.episodeDeleted.subscribe(
            () => {
                this.episodeDeleted();
            }
        )
    }

    episodeDeleted() : void {
        console.info("Episode was deleted.");
        this.updateEpisodes(this.selectedId);
    }

    updateEpisodes(id: string): void {
        this._podcastService.getEpisodes(id).subscribe(
            episodes => {
                this.episodes = episodes;
            },
            error => this.errorMessage = <any>error
        );
    }

    onClickPodcast(id: string): void {
        this.selectedId = id;
        this.updateEpisodes(this.selectedId);
    }

    onClickDelete(id: string): void {
        this._podcastService.deleteEpisode(id)
    }

    getImage(id: string): string {
        // Known ids
        switch(id) {
            case "COTW":
            case "FRIC":
            case "RUFR":
            case "MORL":
            case "TRCK":
            case "DOTW": {
                return "assets/images/podcast/" + id + ".jpg";
            }
        }

        return "assets/images/podcast/Default.png";
    }

    getImageButtonColour(id: string): string {
        // Get the background colour for known ids
        switch(id) {
            case "COTW":
                return "#48B7AE";
            case "FRIC":
                return "#48B7AE";
            case "RUFR":
                return "#243B41";
            case "MORL":
                return "#FFFFFF";
            case "TRCK":
                return "#427092";
            case "DOTW":
                return "#272C30";
        }

        return "#FFFFFF";
    }

    ngOnInit(): void {
        this._podcastService.getPodcasts().subscribe(
            podcasts => {
                this.podcasts = podcasts;
            },
            error => this.errorMessage = <any>error
        );
    }
}
