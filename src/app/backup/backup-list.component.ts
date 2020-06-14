import {Component, OnInit} from "@angular/core";
import {Action} from "./backup-action";
import {FileInfo} from "./backup-fileinfo"
import {HierarchyResponse} from "./backup-hierarchyresponse"
import {BackupService} from "./backup.service";

export enum ListMode { Files, Actions }

@Component({
    templateUrl: './backup-list.component.html',
    styleUrls: ['./backup-list.component.css']
})
export class BackupListComponent implements OnInit {
    actions: Action[];
    heirarchy: HierarchyResponse[];
    topLevel: HierarchyResponse;
    atTopLevel: boolean;
    selectedIndex: number;
    listMode: ListMode;
    selectedFile: FileInfo;
    fileBackups: FileInfo[];
    category: string;

    constructor(private _backupService : BackupService) {
    }

    ngOnInit(): void {
        console.log("Get Actions.");
        this.actions = [];
        this.selectedIndex = -1;
        this.listMode = ListMode.Files;
        this.atTopLevel = true;
        this.topLevel = new HierarchyResponse();
        this.topLevel.id = -1;
        this.selectedFile = null;
        this.fileBackups = [];
        this.category = "AtHome";

        this._backupService.getActions().subscribe(
            actions => {
                this.actions = actions;
                if(actions.length > 0) {
                    this.selectedIndex = 0;
                } else {
                    this.selectedIndex = -1;
                }
            },
            () => console.log("Failed to get actions."),
            () => console.log("Load Actions Complete")
        );

        this._backupService.getHierarchy(this.topLevel).subscribe(
            heirarchy => {
                this.heirarchy = heirarchy;
            },
            () => console.log("Failed to get hierarchy"),
            () => console.log("Load hierarchy complete")
        );
    }

    selectFileMode() {
        this.listMode = ListMode.Files;
        this.selectedFile = null;
        this.fileBackups = [];
    }

    selectActionMode() {
        console.log("SELECT ACTION MODE;.");
        this.listMode = ListMode.Actions;

        if(this.actions.length > 0) {
            this.selectedIndex = 0;

            this.selectedFile = this.actions[0].path;
            this.fileBackups = [];
        }
    }

    get isFileMode() : boolean {
        return this.listMode == ListMode.Files
    }

    get isImage() : boolean {
        if(this.selectedFile == null) {
            return false;
        }

        if(this.selectedFile.classification.isImage) {
            return true;
        }

        return false;
    }

    get isVideo() : boolean {
        if(this.selectedFile == null) {
            return false;
        }

        if(this.selectedFile.classification.isVideo) {
            return true;
        }

        return false;
    }

    get isActionMode() : boolean {
        return this.listMode == ListMode.Actions;
    }

    get isItemSelected(): boolean {

        return this.selectedIndex != -1;
    }

    get detailLine(): string {
        return this.actions.length + " items, selected number: " + ( this.selectedIndex + 1);
    }

    selectTopLevel(): void {
        this.changeHierarchy(this.topLevel);
    }

    changeHierarchy(parent: HierarchyResponse): void {
        this.heirarchy = [];

        this.atTopLevel = parent.id == -1;

        this._backupService.getHierarchy(parent).subscribe(
            heirarchy => {
                this.heirarchy = heirarchy;
            },
            () => console.log("Failed to get hierarchy"),
            () => console.log("Load hierarchy complete")
        );
    }

    moveNext(): void {
        if(this.actions.length <= 0) {
            return;
        }

        this.selectedIndex++;

        if(this.selectedIndex >= this.actions.length) {
            this.selectedIndex = 0;
        }

        this.selectedFile = this.actions[this.selectedIndex].path;
    }

    movePrev(): void {
        if(this.actions.length <= 0) {
            return;
        }

        this.selectedIndex--;

        if(this.selectedIndex < 0) {
            this.selectedIndex = this.actions.length - 1;
        }

        this.selectedFile = this.actions[this.selectedIndex].path;
    }

    displayFile(file: HierarchyResponse): void {
        console.log("Select file " + file.displayName);

        this._backupService.getFile(file.underlyingId).subscribe(
            file => {
                this.selectedFile = file.file;
                this.fileBackups = file.backups;
            },
            () => console.log("Failed to get the file"),
            () => console.log("Get File complete.")
        );
    }

    ignore() {
        this._backupService.ignorePhoto(this.actions[this.selectedIndex].id);

        this.moveNext();
    }

    keep() {
        if(this.category.length == 0) {
            return;
        }

        this._backupService.keepPhoto(this.actions[this.selectedIndex].id,this.category);

        this.moveNext();
    }

    backupStatus(backup: FileInfo): string {
        if(this.selectedFile.date != backup.date) {
            return "fa-exclamation-triangle status-warn";
        }

        if(this.selectedFile.md5 == "") {
            return "fa-exclamation-triangle status-warn";
        }

        if(this.selectedFile.md5 != backup.md5) {
            return "fa-exclamation-triangle status-warn";
        }

        return "fa-check-circle-o status-green";
    }
}
