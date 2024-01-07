import {Component, OnInit, TemplateRef} from "@angular/core";
import {BackupService} from "../../backup.service";
import {FileInfoExtra} from "../../backup-fileinfoextra";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Label} from "../../backup-label";

@Component({
    selector: 'jbr-backup-display-labels',
    templateUrl: './backup-display-label.component.html',
    styleUrls: ['./backup-display-label.component.css']
})
export class BackupDisplayLabelComponent implements OnInit {
    labels: string[];
    labelListModal: BsModalRef;
    allLabels: Label[];
    selectedFileId: number;

    constructor(private readonly _backupService: BackupService,
                private modalService: BsModalService) {
        if(_backupService.fileHasBeenSelected()) {
            this.labels = _backupService.getSelectedFile().labels;
            this.selectedFileId = _backupService.getSelectedFile().file.id;
        }
    }

    ngOnInit(): void {
        this._backupService.getLabels().subscribe(labels => {
            this.allLabels = [];

            labels.forEach(nextLabel => {
                this.allLabels.push(nextLabel);
            });
        });
        this._backupService.fileLoaded.subscribe((nextFile: FileInfoExtra) => this.fileLoaded(nextFile));
    }

    fileLoaded(file: FileInfoExtra): void {
        this.labels = file.labels;
        this.selectedFileId = file.file.id;
    }

    showListSelector(template: TemplateRef<any>):void {
        this.allLabels.forEach(nextLabel => {
            nextLabel.selected = false;
            this.labels.forEach(nextSelected => {
                if(nextSelected == nextLabel.name) {
                    nextLabel.selected = true;
                }
            })
        })
        this.modalService.show(template, {});
    }

    select(id: number) {
        // If the label is currently selected then unselect it, otherwise select it.
        this.allLabels.forEach(nextLabel => {
            if(nextLabel.id == id) {
                if(nextLabel.selected) {
                    this._backupService.removeFileLabel(this.selectedFileId,id);
                    console.log('remove')
                } else {
                    this._backupService.setFileLabel(this.selectedFileId,id);
                    console.log('add')
                }
            }
        })
        this.modalService.hide();
        console.log(id)
    }
}
