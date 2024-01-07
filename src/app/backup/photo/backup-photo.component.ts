import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {BackupService} from "../backup.service";
import {PrintSize, SelectedPrint} from "../backup-selectedprint";

@Component({
    selector: 'jbr-backup-photo',
    templateUrl: './backup-photo.component.html',
    styleUrls: ['./backup-photo.component.css']
})
export class BackupPhotoComponent implements OnInit {
    constructor(private readonly _backupService: BackupService) {
    }

    sizePhoto: SelectedPrint;
    sizes: PrintSize[];

    @Output() exit = new EventEmitter();

    ngOnInit(): void {
        this.sizePhoto = new SelectedPrint();
        this.sizePhoto.border = false;
        this.sizePhoto.blackWhite = false;

        // Populate the combo values.
        this._backupService.getPrintSizes().subscribe(sizes => {
            this.sizes = [];

            sizes.forEach(nextSize => {
                this.sizes.push(nextSize);
            });
        });
    }

    displayText(name: string): string {
        if(name.indexOf(' ') < 0) {
            return name;
        }
        return name.substring(0,name.indexOf(' '));
    }

    getBorderClass(opt: boolean): string {
        if(this.sizePhoto.border == opt) {
            return "btn btn-primary col-4 photo-btn-2";
        }

        return "btn btn-outline-primary col-4 photo-btn-2";
    }

    toggleBorder() {
        this.sizePhoto.border = !this.sizePhoto.border;
    }

    getBlackAndWhiteClass(opt: boolean): string {
        if(this.sizePhoto.blackWhite == opt) {
            return "btn btn-primary col-4 photo-btn-2";
        }

        return "btn btn-outline-primary col-4 photo-btn-2";
    }

    toggleBlackAndWhite() {
        this.sizePhoto.blackWhite = !this.sizePhoto.blackWhite;
    }

    imageUrl(): string {
        if(this._backupService.getSelectedPhoto() == null) {
            return null;
        }

        return this._backupService.imageUrl(this._backupService.getSelectedPhoto().fileId);
    }

    imageALT(): string {
        return this.sizePhoto.fileName;
    }

    exitPhoto() {
        this.exit.emit();
    }

    selectForPrint(size: PrintSize) {
        this._backupService.getSelectedPhoto().sizeId = size.id;
        this._backupService.getSelectedPhoto().sizeName = size.name;
        this._backupService.getSelectedPhoto().blackWhite = this.sizePhoto.blackWhite;
        this._backupService.getSelectedPhoto().border = this.sizePhoto.border;
        this._backupService.selectForPrint();

        this.exit.emit();
    }
}
