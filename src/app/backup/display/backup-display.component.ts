import {Component, OnInit} from "@angular/core";
import {BackupService} from "../backup.service";
import {HierarchyResponse} from "../backup-hierarchyresponse";
import {FileInfo} from "../backup-fileinfo";

@Component({
    selector: 'jbr-backup-display',
    templateUrl: './backup-display.component.html',
    styleUrls: ['./backup-display.component.css']
})
export class BackupDisplayComponent implements OnInit  {
    readonly BACKUP_WARNING = 'fa-exclamation-triangle status-warn';
    readonly BACKUP_OK = 'fa-check-circle-o status-green';

    hierarchy: HierarchyResponse[];
    initialHierarchy: HierarchyResponse;
    atTopLevel: boolean;
    selectedFile: FileInfo;
    fileBackups: FileInfo[];

    constructor(private readonly _backupService: BackupService) {
    }

    ngOnInit(): void {
        this.initialHierarchy = new HierarchyResponse();
        this.initialHierarchy.id = -1;
        this.atTopLevel = true;
        this.fileBackups = [];
        this.selectedFile = null;

        this._backupService.getHierarchy(this.initialHierarchy).subscribe(
            hierarchy => {
                this.hierarchy = hierarchy;
            },
            () => console.log('Failed to get hierarchy'),
            () => console.log('Load hierarchy complete')
        );
    }

    changeHierarchy(parent: HierarchyResponse): void {
        this.hierarchy = [];

        this.atTopLevel = parent.id === -1;

        this._backupService.getHierarchy(parent).subscribe(
            hierarchy => {
                this.hierarchy = hierarchy;
            },
            () => console.log('Failed to get hierarchy'),
            () => console.log('Load hierarchy complete')
        );
    }

    displayFile(file: HierarchyResponse): void {
        console.log(`Select file ${file.displayName}`);

        this._backupService.getFile(file.underlyingId).subscribe(
            nextFile => {
                this.selectedFile = nextFile.file;
                this.fileBackups = nextFile.backups;
            },
            () => console.log('Failed to get the file'),
            () => console.log('Get File complete.')
        );
    }

    backupStatus(backup: FileInfo): string {
        const selectedDate = new Date(this.selectedFile.date);
        const backupDate = new Date(backup.date);
        const difference = Math.abs(selectedDate.getTime() - backupDate.getTime()) / 1000.0;

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

    imageUrl(id: number): string {
        return this._backupService.imageUrl(id);
    }

    videoUrl(id: number): string {
        return this._backupService.videoUrl(id);
    }

    deleteFile() {
        this._backupService.deleteFile(this.selectedFile.id);
    }
}
