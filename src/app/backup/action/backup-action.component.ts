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
        ActionGridHeaderName,
        NgOptimizedImage
    ],
    standalone: true
})
export class BackupActionComponent implements OnInit  {
    actions: Action[];
    selected: Action;

    constructor(private readonly _backupActionService: BackupActionService) {
    }

    ngOnInit(): void {
        console.log('Get Actions.');
        this.actions = [];

        this.refreshActions();
    }

    refreshActions() {
        this.selected = null;
        this._backupActionService.getActions().subscribe({
            next: actions => {
                this.actions = [];

                actions.forEach(nextAction => {
                    if (nextAction.action !== 'IMPORT') {
                        this.actions.push(nextAction);
                    }
                });
            },
            error: err => {
                console.log('Failed to get actions.' + err);
            },
            complete: () => {
                console.log('Load Actions Complete');
            }
        });
    }

    confirm(action: Action) {
        this._backupActionService.confirmRequest(action.id);

        // Remove the action from the list
        this.actions.splice(this.actions.indexOf(action), 1);
    }

    selectMedia(id: number) {
        this.selected = null;
        this.actions.forEach(a => {
            if (a.fileId === id) {
                this.selected = a;
            }
        });
    }

    isMediaSelected(): boolean {
        return this.selected !== null;
    }

    backToActions() {
        this.selected = null;
    }

    isImageSelected() {
        if (this.selected) {
            return this.selected.isImage;
        }

        return false;
    }

    isVideoSelected() {
        if (this.selected) {
            return this.selected.isVideo;
        }

        return false;
    }

    getSelectedFileId() {
        if (this.selected) {
            return this.selected.fileId;
        }

        return 0;
    }
}
