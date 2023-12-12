import {Component, OnInit, TemplateRef} from "@angular/core";
import {BackupService} from "../../backup.service";
import {FileInfoExtra} from "../../backup-fileinfoextra";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
    selector: 'jbr-backup-display-labels',
    templateUrl: './backup-display-label.component.html',
    styleUrls: ['./backup-display-label.component.css']
})
export class BackupDisplayLabelComponent implements OnInit {
    labels: string[];
    labelListModal: BsModalRef;

    constructor(private readonly _backupService: BackupService,
                private modalService: BsModalService) {
        if(_backupService.fileHasBeenSelected()) {
            this.labels = _backupService.getSelectedFile().labels;
        }
    }

    ngOnInit(): void {
        this._backupService.fileLoaded.subscribe((nextFile: FileInfoExtra) => this.fileLoaded(nextFile));
        this.labelListModal.hide();
    }

    fileLoaded(file: FileInfoExtra): void {
        this.labels = file.labels;
    }

    showListSelector(template: TemplateRef<any>):void {
        this.modalService.show(template, {});
    }
}
