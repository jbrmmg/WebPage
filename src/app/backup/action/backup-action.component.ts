import {Component, OnInit} from '@angular/core';
import {Action} from './backup-action';
import {BackupActionService} from './backup-action-service';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {ActionGridDataName} from './data/action-grid-data-name';
import {ActionGridHeaderName} from './header/action-grid-header-name';
import {ActionGridHeaderConfirm} from './header/action-grid-header-confirm';
import {ActionGridDataConfirm} from './data/action-grid-data-confirm';
import {ActionGridHeaderMedia} from './header/action-grid-header-media';
import {ActionGridDataMedia} from './data/action-grid-data-media';

@Component({
    selector: 'jbr-backup-action',
    templateUrl: './backup-action.component.html',
    styleUrls: ['./backup-action.component.css'],
    imports: [
        NgIf,
        NgForOf,
        ActionGridDataName,
        ActionGridHeaderName,
        ActionGridHeaderConfirm,
        ActionGridDataConfirm,
        ActionGridHeaderMedia,
        ActionGridDataMedia,
        NgOptimizedImage
    ],
    standalone: true
})
export class BackupActionComponent implements OnInit {
    actions: Action[] = [];
    selected: Action = null;
    confirmAllPending = false;

    constructor(private readonly _backupActionService: BackupActionService) {}

    ngOnInit(): void {
        this.refreshActions();
    }

    refreshActions(): void {
        this.selected = null;
        this.confirmAllPending = false;
        this._backupActionService.getActions().subscribe({
            next: actions => {
                this.actions = actions.filter(a => a.action !== 'IMPORT');
            },
            error: err => { console.error('❌ Failed to get actions:', err); },
            complete: () => { console.log('✅ Load Actions Complete'); }
        });
    }

    confirm(action: Action): void {
        this._backupActionService.confirmRequest(action.id);
        this.actions.splice(this.actions.indexOf(action), 1);
    }

    requestConfirmAll(): void {
        this.confirmAllPending = true;
    }

    cancelConfirmAll(): void {
        this.confirmAllPending = false;
    }

    confirmAll(): void {
        this.confirmAllPending = false;
        [...this.actions].forEach(a => this._backupActionService.confirmRequest(a.id));
        this.actions = [];
    }

    selectMedia(id: number): void {
        this.selected = this.actions.find(a => a.fileId === id) ?? null;
    }

    isMediaSelected(): boolean { return this.selected !== null; }
    backToActions(): void { this.selected = null; }
    isImageSelected(): boolean { return this.selected?.isImage ?? false; }
    isVideoSelected(): boolean { return this.selected?.isVideo ?? false; }
    getSelectedFileId(): number { return this.selected?.fileId ?? 0; }
}
