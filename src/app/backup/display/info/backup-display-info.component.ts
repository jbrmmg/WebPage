import {Component, OnInit, ViewChild} from "@angular/core";
import {FileInfo} from "../../backup-fileinfo";
import {BackupService} from "../../backup.service";
import {FileInfoExtra} from "../../backup-fileinfoextra";
import {DatePipe, NgIf} from "@angular/common";
import {MetaData} from "../../backup-file-metadata";
import {Map} from "../../map/map";
import {LatLong} from "../../map/map-latlong";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";

@Component({
    selector: 'jbr-backup-display-info',
    templateUrl: './backup-display-info.component.html',
    imports: [
        Map,
        BsDatepickerModule,
        NgIf
    ],
    standalone: true,
    styleUrls: ['./backup-display-info.component.css']
})
export class BackupDisplayInfoComponent implements OnInit {
    selectedFile: FileInfo;
    metaData: MetaData;
    editDateEnable: boolean;
    internalDate: Date;
    minimumDate: Date;

    @ViewChild('map') map: Map;

    constructor(private readonly _backupService: BackupService,
                private datePipe: DatePipe) {
        if(_backupService.fileHasBeenSelected()) {
            this.selectedFile = _backupService.getSelectedFile().file;
            this.metaData = _backupService.getSelectedFile().metaData;
        }
        this.initializeDate();

        this.minimumDate = new Date();
        this.minimumDate.setDate(this.minimumDate.getDate());
        this.minimumDate.setHours(0,0,0,0);
    }

    moveMap() {
        let latLong: LatLong = new LatLong();

        if(this.metaData == null || this.metaData.latitude == null || this.metaData.longitude == null) {
            latLong.lat = 51.60146388888889;
            latLong.long = -0.37789999999999996;
        } else {
            latLong.lat = this.metaData.latitude;
            latLong.long = this.metaData.longitude;
        }

        this.map.move(latLong)
    }

    initializeDate() {
        this.editDateEnable = false;
        this.internalDate = new Date();
        this.internalDate.setDate(this.internalDate.getDate());
        this.internalDate.setHours(0,0,0,0);
    }

    ngOnInit(): void {
        this._backupService.fileLoaded.subscribe((nextFile: FileInfoExtra) => this.fileLoaded(nextFile));

        if(this._backupService.fileHasBeenSelected()) {
            this.moveMap();
        }
    }

    fileLoaded(file: FileInfoExtra): void {
        this.selectedFile = file.file;
        this.metaData = file.metaData;
        this.moveMap();
    }

    editDate(): void {
        this.editDateEnable = (!this.editDateEnable);
    }

    clearExpiry(): void {
        this.initializeDate();
        this._backupService.setFileExpiry(this.selectedFile.id,null);
    }

    get internalExpiryDate(): Date {
        return this.internalDate;
    }

    get formattedExpiryDate(): string {
        if(this.selectedFile == null) {
            return "";
        }

        if(this.selectedFile.expiry == null) {
            return "";
        }

        return this.datePipe.transform(this.selectedFile.expiry,'dd MMMM yyyy');
    }

    get formattedFileDate(): string {
        if(this.selectedFile == null) {
            return "";
        }

        if(this.selectedFile.date == null) {
            return "";
        }

        return this.datePipe.transform(this.selectedFile.date,'dd MMM yyyy HH:mm:ss');
    }

    get metaLocation(): string {
        if(!this.metaData || !this.metaData.latitude || !this.metaData.longitude) {
            return "";
        }

        return this.metaData.latitude + " " + this.metaData.longitude;
    }

    get metaSize(): string {
        if(!this.metaData || !this.metaData.imageHeight || !this.metaData.imageWidth) {
            return "";
        }

        return this.metaData.imageHeight + " x " + this.metaData.imageWidth;
    }

    get metaDuration(): string {
        if(!this.metaData || !this.metaData.duration) {
            return "";
        }

        return "" + this.metaData.duration;
    }

    onChangeExpiry(newDate: Date): void {
        if (newDate > this.minimumDate) {
            this.initializeDate();
            this._backupService.setFileExpiry(this.selectedFile.id, newDate);
        }
    }
}
