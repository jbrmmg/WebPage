import {Component, Input} from '@angular/core';
import {FileInfo} from '../../backup-fileinfo';
import {FileInfoExtra} from '../../backup-fileinfoextra';
import {DatePipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';

@Component({
    selector: 'jbr-backup-display-backups',
    templateUrl: './backups-list.component.html',
    styleUrls: ['./backups-list.component.css'],
    standalone: true,
    imports: [
        NgForOf,
        NgIf,
        DecimalPipe
    ]
})
export class BackupDisplayBackupsComponent {
    readonly BACKUP_WARNING: string = 'fa-exclamation-triangle status-warn';
    readonly BACKUP_OK: string = 'fa-check-circle-o status-green';

    @Input() selectedFile: FileInfoExtra;

    constructor(private readonly datePipe: DatePipe) {
    }

    backupStatus(backup: FileInfo): string {
        if (this.selectedFile.file.md5 === '') {
            return this.BACKUP_WARNING;
        }

        if (this.selectedFile.file.md5 !== backup.md5) {
            return this.BACKUP_WARNING;
        }

        if (this.selectedFile.file.size !== backup.size) {
            return this.BACKUP_WARNING;
        }

        return this.BACKUP_OK;
    }

    backupFileDate(backup: FileInfo): string {
        if (backup == null) {
            return '';
        }

        if (backup.date == null) {
            return '';
        }

        return this.datePipe.transform(backup.date, 'dd MMM yyyy HH:mm');
    }
}
