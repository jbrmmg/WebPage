import {Component, OnInit} from "@angular/core";
import {BackupService} from "./backup.service";
import {Action} from "./backup-action";

@Component({
    templateUrl: './backup-list.component.html',
    styleUrls: ['./backup-list.component.css']
})
export class BackupListComponent implements OnInit {
    actions: Action[];
    selectedIndex: number;
    imageToShow: any;
    isImageLoading: boolean;

    constructor(private _backupService : BackupService) {
    }

    ngOnInit(): void {
        console.log("Get Actions.");
        this.actions = [];
        this.selectedIndex = -1;

        this._backupService.getActions().subscribe(
            actions => {
                this.actions = actions
                this.selectedIndex = 0;
            },
            () => console.log("Failed to get actions."),
            () => console.log("Load Actions Complete")
        );
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
