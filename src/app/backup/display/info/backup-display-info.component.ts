import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FileInfoExtra} from '../../backup-fileinfoextra';
import {DatePipe, DecimalPipe, NgIf} from '@angular/common';
import {LatLong} from '../../map/map-latlong';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {BackupDisplayService} from '../backup-display-service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Map} from '../../map/map';

@Component({
    selector: 'jbr-backup-display-info',
    templateUrl: './backup-display-info.component.html',
    imports: [
        BsDatepickerModule,
        NgIf,
        DecimalPipe,
        Map,
    ],
    standalone: true,
    styleUrls: ['./backup-display-info.component.css']
})
export class BackupDisplayInfoComponent implements OnInit {
    @Input() selectedFile: FileInfoExtra;

    @ViewChild('locationModal') private locationModalTemplate: TemplateRef<any>;
    @ViewChild('dateModal') private dateModalTemplate: TemplateRef<any>;

    editDateEnable: boolean;
    internalDate: Date;
    minimumDate: Date;
    pendingDate: Date;
    pendingTime: string;
    dialogLat: number;
    dialogLng: number;
    dialogLatLong: LatLong;
    private modalRef: BsModalRef;

    constructor(private readonly _backupDisplayService: BackupDisplayService,
                private readonly _modalService: BsModalService,
                private readonly datePipe: DatePipe) {
        this.initializeDate();

        this.minimumDate = new Date();
        this.minimumDate.setDate(this.minimumDate.getDate());
        this.minimumDate.setHours(0, 0, 0, 0);
    }

    initializeDate() {
        this.editDateEnable = false;
        this.internalDate = new Date();
        this.internalDate.setDate(this.internalDate.getDate());
        this.internalDate.setHours(0, 0, 0, 0);
    }

    ngOnInit(): void {}

    editDate(): void {
        this.editDateEnable = (!this.editDateEnable);
    }

    clearExpiry(): void {
        this.initializeDate();
        this._backupDisplayService.setFileExpiry(this.selectedFile.file.id, null);
    }

    get internalExpiryDate(): Date {
        return this.internalDate;
    }

    get formattedExpiryDate(): string {
        if (this.selectedFile?.file?.expiry == null) {
            return '';
        }
        return this.datePipe.transform(this.selectedFile.file.expiry, 'dd MMMM yyyy');
    }

    get formattedFileDate(): string {
        if (this.selectedFile?.file?.date == null) {
            return '';
        }
        return this.datePipe.transform(this.selectedFile.file.date, 'dd MMM yyyy HH:mm:ss');
    }

    onChangeExpiry(newDate: Date): void {
        if (newDate > this.minimumDate) {
            this.initializeDate();
            this._backupDisplayService.setFileExpiry(this.selectedFile.file.id, newDate);
        }
    }

    startDateEdit(): void {
        const d = this.selectedFile?.file?.date ? new Date(this.selectedFile.file.date) : new Date();
        this.pendingDate = new Date(d);
        this.pendingTime = this.datePipe.transform(d, 'HH:mm') ?? '00:00';
        this.modalRef = this._modalService.show(this.dateModalTemplate);
    }

    onPendingDateChange(date: Date): void {
        this.pendingDate = date;
    }

    onPendingTimeChange(value: string): void {
        this.pendingTime = value;
    }

    saveDateEdit(): void {
        if (!this.pendingDate) {
            return;
        }
        const result = new Date(this.pendingDate);
        const parts = (this.pendingTime ?? '00:00').split(':');
        result.setHours(Number(parts[0]), Number(parts[1]), 0, 0);
        this._backupDisplayService.updateFileDate(this.selectedFile.file.id, result);
        this.modalRef?.hide();
    }

    cancelDateEdit(): void {
        this.modalRef?.hide();
    }

    openLocationEditor(): void {
        this.openLocationDialog(this.locationModalTemplate);
    }

    openLocationDialog(template: TemplateRef<any>): void {
        this.dialogLat = null;
        this.dialogLng = null;
        this.dialogLatLong = null;

        const svc = this._backupDisplayService;

        if (svc.lastLocation) {
            this.dialogLat = svc.lastLocation.lat;
            this.dialogLng = svc.lastLocation.long;
        } else if (this.selectedFile?.metaData?.latitude != null) {
            this.dialogLat = this.selectedFile.metaData.latitude;
            this.dialogLng = this.selectedFile.metaData.longitude;
        } else {
            this.dialogLat = 51.60146;
            this.dialogLng = -0.37790;
        }

        this.dialogLatLong = new LatLong();
        this.dialogLatLong.lat = this.dialogLat;
        this.dialogLatLong.long = this.dialogLng;

        this.modalRef = this._modalService.show(template, {class: 'modal-lg'});
    }

    onLocationClick(location: LatLong): void {
        this.dialogLat = location.lat;
        this.dialogLng = location.long;
    }

    saveLocation(): void {
        if (this.dialogLat == null) {
            return;
        }
        this._backupDisplayService.updateFileLocation(
            this.selectedFile.file.id,
            this.dialogLat,
            this.dialogLng
        );
        this.modalRef?.hide();
    }

    cancelLocation(): void {
        this.modalRef?.hide();
    }
}
