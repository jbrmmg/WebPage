import {Component, EventEmitter, Input, Output} from "@angular/core";
import {NgIf} from "@angular/common";
import {BackupDisplayService} from "../backup-display-service";
import {FileInfoExtra} from "../../backup-fileinfoextra";

@Component({
    selector: 'jbr-backup-display-media',
    templateUrl: './backup-display-media.html',
    styleUrls: ['./backup-display-media.css'],
    standalone: true,
    imports: [
        NgIf
    ]
})
export class BackupDisplayMedia {
    @Input() selectedFile: FileInfoExtra;

    @Output() selectPhotoModeEvent: EventEmitter<void> = new EventEmitter<void>();

    constructor(private readonly _backupDisplayService: BackupDisplayService) {
    }

    selectPhotoMode() {
        this.selectPhotoModeEvent.emit();
    }

    imageUrl(id: number): string {
        return this._backupDisplayService.imageUrl(id);
    }

    imageALT(): string {
        return this.selectedFile.file.name;
    }

    videoUrl(id: number): string {
        return this._backupDisplayService.videoUrl(id);
    }
}
