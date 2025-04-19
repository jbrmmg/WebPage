import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {Map} from "../../map/map";
import {FileInfoExtra} from "../../backup-fileinfoextra";

@Component({
    selector: 'jbr-backup-display-metadata',
    templateUrl: './backup-display-metadata.html',
    styleUrls: ['./backup-display-metadata.css'],
    standalone: true,
    imports: [
        Map
    ]
})
export class BackupDisplayMetadata implements OnInit {
    @Input() selectedFile: FileInfoExtra;

    @ViewChild('map') map: Map;

    ngOnInit(): void {
    }

    hasLocation(): boolean {
        return !!(this.selectedFile.metaData && (this.selectedFile.metaData.latitude || this.selectedFile.metaData.longitude));
    }

    getLocation(): string {
        return "" + this.selectedFile.metaData.latitude + " " + this.selectedFile.metaData.longitude;
    }

    hasSize(): boolean {
        return !!(this.selectedFile.metaData && (this.selectedFile.metaData.imageWidth || this.selectedFile.metaData.imageHeight));
    }

    getSize(): string {
        return "" + this.selectedFile.metaData.imageWidth + " x " + this.selectedFile.metaData.imageHeight;
    }

    hasDuration(): boolean {
        return !!(this.selectedFile.metaData && this.selectedFile.metaData.duration);
    }

    getDuration(): string {
        return "" + this.selectedFile.metaData.duration + " seconds";
    }

    hasDate(): boolean {
        return !!(this.selectedFile.metaData && this.selectedFile.metaData.date);
    }

    getDate(): string {
        return "" + this.selectedFile.metaData.date.toString().replace("T", " ");
    }
}
