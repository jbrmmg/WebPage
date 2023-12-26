import {Component, OnInit} from "@angular/core";
import {FileInfo} from "../../backup-fileinfo";
import {BackupService} from "../../backup.service";
import {FileInfoExtra} from "../../backup-fileinfoextra";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'jbr-backup-display-info',
    templateUrl: './backup-display-info.component.html',
    styleUrls: ['./backup-display-info.component.css']
})
export class BackupDisplayInfoComponent implements OnInit {
    selectedFile: FileInfo;
    editDateEnable: boolean;
    internalDate: Date;
    minimumDate: Date;

    constructor(private readonly _backupService: BackupService,
                private datePipe: DatePipe) {
        if(_backupService.fileHasBeenSelected()) {
            this.selectedFile = _backupService.getSelectedFile().file;
        }
        this.initializeDate();

        this.minimumDate = new Date();
        this.minimumDate.setDate(this.minimumDate.getDate());
        this.minimumDate.setHours(0,0,0,0);
    }

    initializeDate() {
        this.editDateEnable = false;
        this.internalDate = new Date();
        this.internalDate.setDate(this.internalDate.getDate());
        this.internalDate.setHours(0,0,0,0);
    }

    ngOnInit(): void {
        this._backupService.fileLoaded.subscribe((nextFile: FileInfoExtra) => this.fileLoaded(nextFile));
    }

    fileLoaded(file: FileInfoExtra): void {
        this.selectedFile = file.file;
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

    onChangeExpiry(newDate: Date): void {
        if (newDate > this.minimumDate) {
            this.initializeDate();
            this._backupService.setFileExpiry(this.selectedFile.id, newDate);
        }
    }
}
