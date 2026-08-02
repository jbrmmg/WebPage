import {Component, OnInit} from '@angular/core';
import {BackupActionService} from './action/backup-action-service';

export enum ListMode { Files, Actions, Summary, Import, Logs, Photo, Prints }

@Component({
    templateUrl: './backup-list.component.html',
    styleUrls: ['./backup-list.component.css']
})
export class BackupListComponent implements OnInit {
    listMode: ListMode;
    actionCount = 0;

    constructor(private readonly _backupActionService: BackupActionService) {}

    ngOnInit(): void {
        this.listMode = ListMode.Files;
        this._backupActionService.getActions().subscribe({
            next: actions => { this.actionCount = actions.length; },
            error: () => { this.actionCount = 0; }
        });
    }

    selectFileMode() { this.listMode = ListMode.Files; }
    selectActionMode() { this.listMode = ListMode.Actions; }
    selectSummaryMode() { this.listMode = ListMode.Summary; }
    selectImportMode() { this.listMode = ListMode.Import; }
    selectLogMode() { this.listMode = ListMode.Logs; }
    selectPhotoMode() { this.listMode = ListMode.Photo; }
    selectPrintsMode() { this.listMode = ListMode.Prints; }

    get isFileMode(): boolean { return this.listMode === ListMode.Files; }
    get isActionMode(): boolean { return this.listMode === ListMode.Actions; }
    get isSummaryMode(): boolean { return this.listMode === ListMode.Summary; }
    get isImportMode(): boolean { return this.listMode === ListMode.Import; }
    get isLogMode(): boolean { return this.listMode === ListMode.Logs; }
    get isPhotoMode(): boolean { return this.listMode === ListMode.Photo; }
    get isPrintsMode(): boolean { return this.listMode === ListMode.Prints; }
}
