import {Component, OnInit} from "@angular/core";
import {Action} from "./backup-action";
import {FileInfo} from "../backup-fileinfo";
import {BackupActionService} from "./backup-action-service";
import {NgForOf, NgIf} from "@angular/common";
import {ActionGridDataName} from "./data/action-grid-data-name";
import {ActionGridHeaderName} from "./header/action-grid-header-name";
import {ActionGridHeaderConfirm} from "./header/action-grid-header-confirm";
import {ActionGridDataConfirm} from "./data/action-grid-data-confirm";
import {ActionGridHeaderMedia} from "./header/action-grid-header-media";
import {ActionGridDataMedia} from "./data/action-grid-data-media";

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
        ActionGridHeaderName
    ],
    standalone: true
})
export class BackupActionComponent implements OnInit  {
    actions: Action[];
    selectedIndex: number;
    selectedFile: FileInfo;

    constructor(private readonly _backupActionService: BackupActionService) {
    }

    ngOnInit(): void {
        console.log('Get Actions.');
        this.actions = [];
        this.selectedIndex = -1;

        this.selectedFile = null;

        this._backupActionService.getActions().subscribe(
            actions => {
                this.actions = [];

                actions.forEach(nextAction => {
                    if(nextAction.action !== "IMPORT") {
                        this.actions.push(nextAction);
                    }
                })

                if (actions.length > 0) {
                    this.selectedIndex = 0;
                } else {
                    this.selectedIndex = -1;
                }
            },
            () => console.log('Failed to get actions.'),
            () => console.log('Load Actions Complete')
        );
    }

    confirm(action: Action) {
        this._backupActionService.confirmRequest(action.id);
    }
}
