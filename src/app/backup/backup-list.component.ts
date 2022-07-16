import {Component, OnInit} from '@angular/core';
import {Action} from './backup-action';
import {FileInfo} from './backup-fileinfo';
import {HierarchyResponse} from './backup-hierarchyresponse';
import {BackupService} from './backup.service';

export enum ListMode { Files, Actions, Summary, import }

@Component({
    templateUrl: './backup-list.component.html',
    styleUrls: ['./backup-list.component.css']
})
export class BackupListComponent implements OnInit {
    readonly BACKUP_WARNING = 'fa-exclamation-triangle status-warn';
    readonly BACKUP_OK = 'fa-check-circle-o status-green';

    actions: Action[];
    hierarchy: HierarchyResponse[];
    initialHierarchy: HierarchyResponse;
    atTopLevel: boolean;
    selectedIndex: number;
    listMode: ListMode;
    selectedFile: FileInfo;
    fileBackups: FileInfo[];
    category: string;

    constructor(private readonly _backupService: BackupService) {
    }

    ngOnInit(): void {
        console.log('Get Actions.');
        this.actions = [];
        this.selectedIndex = -1;
        this.listMode = ListMode.Files;
        this.atTopLevel = true;
        this.initialHierarchy = new HierarchyResponse();
        this.initialHierarchy.id = -1;
        this.selectedFile = null;
        this.fileBackups = [];
        this.category = 'AtHome';

        this._backupService.getActions().subscribe(
            actions => {
                this.actions = actions;
                if (actions.length > 0) {
                    this.selectedIndex = 0;
                } else {
                    this.selectedIndex = -1;
                }
            },
            () => console.log('Failed to get actions.'),
            () => console.log('Load Actions Complete')
        );

        this._backupService.getHierarchy(this.initialHierarchy).subscribe(
            hierarchy => {
                this.hierarchy = hierarchy;
            },
            () => console.log('Failed to get hierarchy'),
            () => console.log('Load hierarchy complete')
        );
    }

    selectFileMode() {
        this.listMode = ListMode.Files;
        this.selectedFile = null;
        this.fileBackups = [];
    }

    selectActionMode() {
        console.log('SELECT ACTION MODE;.');
        this.listMode = ListMode.Actions;

        if (this.actions.length > 0) {
            this.selectedIndex = 0;

            this.selectedFile = null;
            this.fileBackups = [];
        }
    }

    selectSummaryMode() {
        this.listMode = ListMode.Summary;
    }

    selectImportMode() {
        this.listMode = ListMode.import;
    }

    get isFileMode(): boolean {
        return this.listMode === ListMode.Files;
    }

    get isActionMode(): boolean {
        return this.listMode === ListMode.Actions;
    }

    get isSummaryMode(): boolean {
        return this.listMode === ListMode.Summary;
    }

    get isImportMode(): boolean {
        return this.listMode === ListMode.import;
    }

    imageUrl(id: number): string {
        return this._backupService.imageUrl(id);
    }

    videoUrl(id: number): string {
        return this._backupService.videoUrl(id);
    }

    get isItemSelected(): boolean {

        return this.selectedIndex !== -1;
    }

    get detailLine(): string {
        return `${this.actions.length} items, selected number: ${this.selectedIndex + 1}`;
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

    moveNext(): void {
        if (this.actions.length <= 0) {
            return;
        }

        this.selectedIndex++;

        if (this.selectedIndex >= this.actions.length) {
            this.selectedIndex = 0;
        }
    }

    movePrev(): void {
        if (this.actions.length <= 0) {
            return;
        }

        this.selectedIndex--;

        if (this.selectedIndex < 0) {
            this.selectedIndex = this.actions.length - 1;
        }
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

    ignore() {
        this._backupService.ignorePhoto(this.actions[this.selectedIndex].id);

        this.moveNext();
    }

    deleteFile() {
        this._backupService.deleteFile(this.selectedFile.id);
    }

    keep() {
        if (this.category.length === 0) {
            return;
        }

        this._backupService.keepPhoto(this.actions[this.selectedIndex].id, this.category);

        this.moveNext();
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
}
