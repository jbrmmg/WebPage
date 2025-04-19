import {Component, Input, OnInit} from "@angular/core";
import {BackupService} from "../../backup.service";
import {FileInfoExtra} from "../../backup-fileinfoextra";
import {DatePipe, DecimalPipe, NgIf} from "@angular/common";
import {MetaData} from "../../backup-file-metadata";
import {LatLong} from "../../map/map-latlong";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";

@Component({
    selector: 'jbr-backup-display-info',
    templateUrl: './backup-display-info.component.html',
    imports: [
        BsDatepickerModule,
        NgIf,
        DecimalPipe
    ],
    standalone: true,
    styleUrls: ['./backup-display-info.component.css']
})
export class BackupDisplayInfoComponent implements OnInit {
    @Input() selectedFile: FileInfoExtra;

    metaData: MetaData;
    editDateEnable: boolean;
    internalDate: Date;
    minimumDate: Date;

    constructor(private readonly _backupService: BackupService,
                private datePipe: DatePipe) {
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
    }

    initializeDate() {
        this.editDateEnable = false;
        this.internalDate = new Date();
        this.internalDate.setDate(this.internalDate.getDate());
        this.internalDate.setHours(0,0,0,0);
    }

    ngOnInit(): void {
        if(this._backupService.fileHasBeenSelected()) {
            this.moveMap();
        }
    }

    editDate(): void {
        this.editDateEnable = (!this.editDateEnable);
    }

    clearExpiry(): void {
        this.initializeDate();
        this._backupService.setFileExpiry(this.selectedFile.file.id,null);
    }

    get internalExpiryDate(): Date {
        return this.internalDate;
    }

    get formattedExpiryDate(): string {
        if(this.selectedFile == null) {
            return "";
        }

        if(this.selectedFile.file.expiry == null) {
            return "";
        }

        return this.datePipe.transform(this.selectedFile.file.expiry,'dd MMMM yyyy');
    }

    get formattedFileDate(): string {
        if(this.selectedFile == null) {
            return "";
        }

        if(this.selectedFile.file.date == null) {
            return "";
        }

        return this.datePipe.transform(this.selectedFile.file.date,'dd MMM yyyy HH:mm:ss');
    }

    onChangeExpiry(newDate: Date): void {
        if (newDate > this.minimumDate) {
            this.initializeDate();
            this._backupService.setFileExpiry(this.selectedFile.file.id, newDate);
        }
    }
}
