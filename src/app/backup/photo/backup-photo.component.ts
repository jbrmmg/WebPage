import {Component, EventEmitter, OnInit, Output, TemplateRef} from "@angular/core";
import {BackupService} from "../backup.service";
import {SelectedPrint} from "../backup-selectedprint";
import {BsModalService} from "ngx-bootstrap/modal";

@Component({
    selector: 'jbr-backup-photo',
    templateUrl: './backup-photo.component.html',
    styleUrls: ['./backup-photo.component.css']
})
export class BackupPhotoComponent implements OnInit {
    constructor(private readonly _backupService: BackupService,
                private readonly _modalService: BsModalService) {
    }

    sizePhoto: SelectedPrint;

    @Output() exit = new EventEmitter();

    ngOnInit(): void {
    }

    imageUrl(): string {
        if(this._backupService.getSelectedPhoto() == null) {
            return null;
        }

        return this._backupService.imageUrl(this._backupService.getSelectedPhoto().fileId);
    }

    exitPhoto() {
        this.exit.emit();
    }

    selectForPrint(template: TemplateRef<any>) {
        this.sizePhoto = this._backupService.getSelectedPhoto();
        this._modalService.show(template);
    }

    onSizeChange(selection: SelectedPrint) {
        this._modalService.hide();

        if(selection != null) {
            this._backupService.getSelectedPhoto().sizeId = selection.sizeId;
            this._backupService.getSelectedPhoto().blackWhite = selection.blackWhite;
            this._backupService.getSelectedPhoto().border = selection.border;
            this._backupService.selectForPrint();
        }

        this.exit.emit();
    }
}
