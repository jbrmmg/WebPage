import {Component, Input, OnInit} from "@angular/core";
import {FileInfo} from "../../backup-fileinfo";
import {FileInfoExtra} from "../../backup-fileinfoextra";
import {BackupService} from "../../backup.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";

@Component({
    selector: 'jbr-backup-display-backups',
    templateUrl: './backups-list.component.html',
    styleUrls: ['./backups-list.component.css'],
    standalone: true,
    imports: [
        NgForOf,
        NgIf
    ]
})
export class BackupDisplayBackupsComponent implements OnInit {
    readonly BACKUP_WARNING : string = 'fa-exclamation-triangle status-warn';
    readonly BACKUP_OK: string = 'fa-check-circle-o status-green';

    @Input() selectedFile: FileInfoExtra;

    constructor(private readonly _backupService: BackupService,
                private datePipe: DatePipe) {
    }

    ngOnInit(): void {
    }

    backupStatus(backup: FileInfo): string {
        const selectedDate : Date = new Date(this.selectedFile.file.date);
        const backupDate : Date = new Date(backup.date);
        const difference : number = Math.abs(selectedDate.getTime() - backupDate.getTime()) / 1000.0;

        if (difference > 30) {
            console.log(`Difference - ${difference} ${backup.date} ${this.selectedFile.file.date}`);
            return this.BACKUP_WARNING;
        }

        if (this.selectedFile.file.md5 === '') {
            return this.BACKUP_WARNING;
        }

        if (this.selectedFile.file.md5 !== backup.md5) {
            return this.BACKUP_WARNING;
        }

        return this.BACKUP_OK;
    }

    backupFileDate(backup: FileInfo): string {
        if(backup == null) {
            return "";
        }

        if(backup.date == null) {
            return "";
        }

        return this.datePipe.transform(backup.date,'dd MMM yyyy HH:mm');
    }
}
