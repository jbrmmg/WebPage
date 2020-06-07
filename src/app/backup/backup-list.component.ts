import {Component, OnInit} from "@angular/core";
import {BackupService} from "./backup.service";
import {Action} from "./backup-action";

export enum ListMode { Files, Actions }

@Component({
    templateUrl: './backup-list.component.html',
    styleUrls: ['./backup-list.component.css']
})
export class BackupListComponent implements OnInit {
    actions: Action[];
    selectedIndex: number;
    imageToShow: any;
    isImageLoading: boolean;
    listMode: ListMode;

    constructor(private _backupService : BackupService) {
    }

    ngOnInit(): void {
        console.log("Get Actions.");
        this.actions = [];
        this.selectedIndex = -1;
        this.listMode = ListMode.Files;

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
    }

    selectFileMode() {
        this.listMode = ListMode.Files;
    }

    get isFileMode() : boolean {
        return this.listMode == ListMode.Files
    }

    selectActionMode() {
        console.log("SELECT ACTION MODE;.");
        this.listMode = ListMode.Actions;
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

    moveNext(): void {
        this.selectedIndex++;

        if(this.selectedIndex > this.actions.length) {
            this.selectedIndex = 0;
        }

        this.refresh();
    }

    createImageFromBlob(image: Blob) {
        let reader = new FileReader();
        reader.addEventListener("load",
            () => {
                this.imageToShow = reader.result;
            },
            false);

        if (image) {
            console.log("Image type " + image.type)
            if (image.type !== "application/pdf")
                reader.readAsDataURL(image);
        }
    }

    ignore() {
        this._backupService.ignorePhoto(this.actions[this.selectedIndex].id);

        this.moveNext();
    }

    keep() {
        this._backupService.keepPhoto(this.actions[this.selectedIndex].id);

        this.moveNext();
    }

    refresh() {
        // Load the image.
        this.isImageLoading = true;
        this._backupService.getCustomerImages(this.actions[this.selectedIndex].id).subscribe(
            data => {
                console.log("Getting image.");
                this.createImageFromBlob(data);
                console.log("Getting image done.");
                this.isImageLoading = false;
            },
            error => {
                this.isImageLoading = false;
            }
        );
    }

    movePrev(): void {
        this.selectedIndex--;

        if(this.selectedIndex < 0) {
            this.selectedIndex = this.actions.length - 1;
        }

        this.refresh();
    }
}
