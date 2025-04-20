import {Component, Input, OnChanges, SimpleChanges, ViewChild} from "@angular/core";
import {Map} from "../../map/map";
import {FileInfoExtra} from "../../backup-fileinfoextra";
import {NgIf} from "@angular/common";
import {LatLong} from "../../map/map-latlong";

@Component({
    selector: 'jbr-backup-display-metadata',
    templateUrl: './backup-display-metadata.html',
    styleUrls: ['./backup-display-metadata.css'],
    standalone: true,
    imports: [
        Map,
        NgIf
    ]
})
export class BackupDisplayMetadata implements OnChanges {
    @Input() selectedFile: FileInfoExtra;

    @ViewChild('map') map: Map;

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.selectedFile) {
            if(this.map && this.selectedFile && this.selectedFile.metaData && (this.selectedFile.metaData.longitude || this.selectedFile.metaData.latitude)) {
                let latLong: LatLong = new LatLong();
                latLong.lat = this.selectedFile.metaData.latitude;
                latLong.long = this.selectedFile.metaData.longitude;

                this.map.move(latLong);
            }
        }
    }

    hasMetaData(): boolean {
        return !!(this.selectedFile.metaData);
    }

    hasLocation(): boolean {
        return !!(this.selectedFile.metaData && (this.selectedFile.metaData.latitude || this.selectedFile.metaData.longitude));
    }

    getLocation(): string {
        return "" + this.selectedFile.metaData.latitude + " " + this.selectedFile.metaData.longitude;
    }

    getLatLong(): LatLong {
        if(this.selectedFile.metaData && this.selectedFile.metaData.latitude && this.selectedFile.metaData.longitude) {
            let result: LatLong = new LatLong();
            result.lat = this.selectedFile.metaData.latitude;
            result.long = this.selectedFile.metaData.longitude;
            return result;
        }

        return null;
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
