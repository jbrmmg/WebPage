import {Component, OnInit} from "@angular/core";
import {FileInfo} from "../../backup-fileinfo";
import {FileInfoExtra} from "../../backup-fileinfoextra";
import {BackupService} from "../../backup.service";

@Component({
    selector: 'jbr-backup-display-backups',
    templateUrl: './backups-list.component.html',
    styleUrls: ['./backups-list.component.css']
})
export class BackupDisplayBackupsComponent implements OnInit {
    readonly BACKUP_WARNING : string = 'fa-exclamation-triangle status-warn';
    readonly BACKUP_OK: string = 'fa-check-circle-o status-green';

    selectedFile: FileInfo;
    fileBackups : FileInfo[];

    constructor(private readonly _backupService: BackupService) {
        if(_backupService.fileHasBeenSelected()) {
            this.selectedFile = _backupService.getSelectedFile().file;
            this.fileBackups = _backupService.getSelectedFile().backups;
        }
    }

    ngOnInit(): void {
        this._backupService.fileLoaded.subscribe((nextFile: FileInfoExtra) => this.fileLoaded(nextFile));
    }

    fileLoaded(file: FileInfoExtra): void {
        this.selectedFile = file.file;
        this.fileBackups = file.backups;
    }

    backupStatus(backup: FileInfo): string {
        const selectedDate : Date = new Date(this.selectedFile.date);
        const backupDate : Date = new Date(backup.date);
        const difference : number = Math.abs(selectedDate.getTime() - backupDate.getTime()) / 1000.0;

        if (difference > 30) {
            console.log(`Difference - ${difference} ${backup.date} ${this.selectedFile.date}`);
            return this.BACKUP_WARNING;
        }

        if (this.selectedFile.md5 === '') {
            return this.BACKUP_WARNING;
        }

        if (this.selectedFile.md5 !== backup.md5) {
            return this.BACKUP_WARNING;
        }

        return this.BACKUP_OK;
    }
}
