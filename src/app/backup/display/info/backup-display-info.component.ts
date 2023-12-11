import {Component, OnInit} from "@angular/core";
import {FileInfo} from "../../backup-fileinfo";
import {BackupService} from "../../backup.service";
import {FileInfoExtra} from "../../backup-fileinfoextra";

@Component({
    selector: 'jbr-backup-display-info',
    templateUrl: './backup-display-info.component.html',
    styleUrls: ['./backup-display-info.component.css']
})
export class BackupDisplayInfoComponent implements OnInit {
    selectedFile: FileInfo;

    constructor(private readonly _backupService: BackupService) {
        if(_backupService.fileHasBeenSelected()) {
            this.selectedFile = _backupService.getSelectedFile().file;
        }
    }

    ngOnInit(): void {
        this._backupService.fileLoaded.subscribe((nextFile: FileInfoExtra) => this.fileLoaded(nextFile));
    }

    fileLoaded(file: FileInfoExtra): void {
        this.selectedFile = file.file;
    }
}
