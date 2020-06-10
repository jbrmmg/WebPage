import {Component, OnInit} from "@angular/core";
import {BackupService, FileInfo, HierarchyResponse} from "./backup.service";
import {Action} from "./backup-action";

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
    imageToShow: any;
    isImageLoading: boolean;
    fileImageToShow: any;
    fileImageLoading: boolean;
    listMode: ListMode;
    selectedFile: FileInfo;

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
    }

    get isFileMode() : boolean {
        return this.listMode == ListMode.Files
    }

    get isImage() : boolean {
        if(this.selectedFile == null) {
            return false;
        }

        if(this.selectedFile.name.toLocaleLowerCase().endsWith(".jpg")) {
            return true;
        }

        return false;
    }

    get isVideo() : boolean {
        if(this.selectedFile == null) {
            return false;
        }

        if(this.selectedFile.name.toLocaleLowerCase().endsWith(".mov")) {
            return true;
        }

        if(this.selectedFile.name.toLocaleLowerCase().endsWith(".mp4")) {
            return true;
        }

        return false;
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

    displayFile(file: HierarchyResponse): void {
        console.log("Select file " + file.displayName);

        this._backupService.getFile(file.underlyingId).subscribe(
            file => {
                this.selectedFile = file;
            },
            () => console.log("Failed to get the file"),
            () => {
                console.log("Get File complete.");
                this.fileImageLoading = true;
                this._backupService.getFileImage(file.underlyingId).subscribe(
                    data => {
                        this.createImageFromBlob2(data);
                        this.fileImageLoading = false;
                    },
                    () => {
                        this.fileImageLoading = false;
                        console.log("Failed to get the file image")
                    },
                    () => {
                        this.fileImageLoading = false;
                        console.log("Loaded file image")
                    }
                )
            }
        )
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

    createImageFromBlob2(image: Blob) {
        let reader = new FileReader();
        reader.addEventListener("load",
            () => {
                this.fileImageToShow = reader.result;
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
