import {Component, OnInit} from "@angular/core";
import {Action} from "./backup-action";
import {FileInfo} from "../backup-fileinfo";
import {BackupActionService} from "./backup-action-service";
import {NgForOf, NgIf} from "@angular/common";
import {ActionGridDataName} from "./data/action-grid-data-name";
import {ActionGridHeaderName} from "./header/action-grid-header-name";
import {ActionGridHeaderAction} from "./header/action-grid-header-action";
import {ActionGridHeaderImage} from "./header/action-grid-header-image";
import {ActionGridHeaderVideo} from "./header/action-grid-header-video";
import {ActionGridHeaderDate} from "./header/action-grid-header-date";
import {ActionGridHeaderSize} from "./header/action-grid-header-size";
import {ActionGridHeaderConfirmed} from "./header/action-grid-header-confirmed";
import {ActionGridHeaderButtons} from "./header/action-grid-header-buttons";
import {ActionGridDataAction} from "./data/action-grid-data-action";
import {ActionGridDataImage} from "./data/action-grid-data-image";
import {ActionGridDataVideo} from "./data/action-grid-data-video";
import {ActionGridDataDate} from "./data/action-grid-data-date";
import {ActionGridDataSize} from "./data/action-grid-data-size";
import {ActionGridDataConfirmed} from "./data/action-grid-data-confirmed";
import {ActionGridDataButtons} from "./data/action-grid-data-buttons";

@Component({
    selector: 'jbr-backup-action',
    templateUrl: './backup-action.component.html',
    styleUrls: ['./backup-action.component.css'],
    imports: [
        NgIf,
        NgForOf,
        ActionGridDataName,
        ActionGridHeaderName,
        ActionGridHeaderAction,
        ActionGridHeaderImage,
        ActionGridHeaderVideo,
        ActionGridHeaderDate,
        ActionGridHeaderSize,
        ActionGridHeaderConfirmed,
        ActionGridHeaderButtons,
        ActionGridDataAction,
        ActionGridDataImage,
        ActionGridDataVideo,
        ActionGridDataDate,
        ActionGridDataSize,
        ActionGridDataConfirmed,
        ActionGridDataButtons
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

    get isItemSelected(): boolean {
        return this.actions.length > 0 && this.selectedIndex !== -1;
    }

    get detailLine(): string {
        return `${this.actions.length} items, selected number: ${this.selectedIndex + 1}`;
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

    confirm() {
        this._backupActionService.confirmRequest(this.actions[this.selectedIndex].id);

        this.moveNext();
    }
}
