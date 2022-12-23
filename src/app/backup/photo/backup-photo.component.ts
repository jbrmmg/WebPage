import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {BackupService} from "../backup.service";

@Component({
    selector: 'jbr-backup-photo',
    templateUrl: './backup-photo.component.html',
    styleUrls: ['./backup-photo.component.css']
})
export class BackupPhotoComponent implements OnInit {
    constructor(private readonly _backupService: BackupService) {
    }

    @Output() exit = new EventEmitter();

    ngOnInit(): void {
    }

    imageUrl(): string {
        return this._backupService.imageUrl(this._backupService.getSelectedPhoto());
    }

    exitPhoto() {
        this.exit.emit();
    }

    selectForPrint() {
        this._backupService.selectForPrint();
    }
}
