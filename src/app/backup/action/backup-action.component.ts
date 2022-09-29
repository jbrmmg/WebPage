import {Component, OnInit} from "@angular/core";
import {BackupService} from "../backup.service";
import {Action} from "../backup-action";
import {FileInfo} from "../backup-fileinfo";

@Component({
    selector: 'jbr-backup-action',
    templateUrl: './backup-action.component.html',
    styleUrls: ['./backup-action.component.css']
})
export class BackupActionComponent implements OnInit  {
    actions: Action[];
    selectedIndex: number;
    selectedFile: FileInfo;

    constructor(private readonly _backupService: BackupService) {
    }

    ngOnInit(): void {
        console.log('Get Actions.');
        this.actions = [];
        this.selectedIndex = -1;

        this.selectedFile = null;

        this._backupService.getActions().subscribe(
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
        this._backupService.confirmRequest(this.actions[this.selectedIndex].id);

        this.moveNext();
    }
}
