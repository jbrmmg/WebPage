import {Component, OnInit} from "@angular/core";
import {BackupService} from "../../backup.service";
import {FileInfoExtra} from "../../backup-fileinfoextra";

@Component({
    selector: 'jbr-backup-display-labels',
    templateUrl: './backup-display-label.component.html',
    styleUrls: ['./backup-display-label.component.css']
})
export class BackupDisplayLabelComponent implements OnInit {
    labels: string[];

    constructor(private readonly _backupService: BackupService) {
        if(_backupService.fileHasBeenSelected()) {
            this.labels = _backupService.getSelectedFile().labels;
        }
    }

    ngOnInit(): void {
        this._backupService.fileLoaded.subscribe((nextFile: FileInfoExtra) => this.fileLoaded(nextFile));
    }

    fileLoaded(file: FileInfoExtra): void {
        this.labels = file.labels;
    }
}
