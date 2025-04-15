import {Component, OnInit} from "@angular/core";
import {Action} from "./backup-action";
import {FileInfo} from "../backup-fileinfo";
import {BackupActionService} from "./backup-action-service";
import {NgForOf, NgIf} from "@angular/common";
import {ActionGridDataName} from "./data/action-grid-data-name";
import {ActionGridHeaderName} from "./header/action-grid-header-name";

@Component({
    selector: 'jbr-backup-action',
    templateUrl: './backup-action.component.html',
    styleUrls: ['./backup-action.component.css'],
    imports: [
        NgIf,
        NgForOf,
        ActionGridDataName,
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
