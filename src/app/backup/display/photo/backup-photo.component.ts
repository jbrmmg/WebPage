import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {PrintSize, SelectedPrint} from "../../backup-selectedprint";
import {BackupPrintService} from "../../backup-print-service";
import {BackupDisplayService} from "../backup-display-service";
import {NgForOf} from "@angular/common";

@Component({
    selector: 'jbr-backup-photo',
    templateUrl: './backup-photo.component.html',
    styleUrls: ['./backup-photo.component.css'],
    imports: [
        NgForOf
    ],
    standalone: true
})
export class BackupPhotoComponent implements OnInit {
    constructor(private readonly _backupPrintService: BackupPrintService,
                private readonly _backupDisplayService: BackupDisplayService) {
    }

    sizePhoto: SelectedPrint;
    sizes: PrintSize[];

    @Output() exit = new EventEmitter();

    ngOnInit(): void {
        this.sizePhoto = new SelectedPrint();
        this.sizePhoto.border = false;
        this.sizePhoto.blackWhite = false;

        // Populate the combo values.
        this._backupPrintService.getPrintSizes().subscribe(sizes => {
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
        if(this._backupPrintService.getSelectedPhoto() == null) {
            return null;
        }

        return this._backupDisplayService.imageUrl(this._backupPrintService.getSelectedPhoto().fileId);
    }

    imageALT(): string {
        return this.sizePhoto.fileName;
    }

    exitPhoto() {
        this.exit.emit();
    }

    selectForPrint(size: PrintSize) {
        this._backupPrintService.getSelectedPhoto().sizeId = size.id;
        this._backupPrintService.getSelectedPhoto().sizeName = size.name;
        this._backupPrintService.getSelectedPhoto().blackWhite = this.sizePhoto.blackWhite;
        this._backupPrintService.getSelectedPhoto().border = this.sizePhoto.border;
        this._backupPrintService.selectForPrint();

        this.exit.emit();
    }
}
