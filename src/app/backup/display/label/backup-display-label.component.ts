import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {FileInfoExtra} from '../../backup-fileinfoextra';
import {BsModalService} from 'ngx-bootstrap/modal';
import {Label} from '../../backup-label';
import {NgClass, NgForOf} from '@angular/common';
import {BackupDisplayService} from '../backup-display-service';

@Component({
    selector: 'jbr-backup-display-labels',
    templateUrl: './backup-display-label.component.html',
    styleUrls: ['./backup-display-label.component.css'],
    standalone: true,
    imports: [
        NgClass,
        NgForOf
    ]
})
export class BackupDisplayLabelComponent implements OnInit {
    @Input() selectedFile: FileInfoExtra;

    allLabels: Label[];

    constructor(private readonly _backupDisplayService: BackupDisplayService,
                private readonly modalService: BsModalService) {
    }

    ngOnInit(): void {
        this._backupDisplayService.getLabels().subscribe(labels => {
            this.allLabels = [];

            labels.forEach(nextLabel => {
                this.allLabels.push(nextLabel);
            });
        });
    }

    showListSelector(template: TemplateRef<any>): void {
        if (this.selectedFile == null) {
            return;
        }

        this.allLabels.forEach(nextLabel => {
            nextLabel.selected = false;
            this.selectedFile.labels.forEach(nextSelected => {
                if (nextSelected === nextLabel.name) {
                    nextLabel.selected = true;
                }
            });
        });

        this.modalService.show(template, {});
    }

    select(id: number) {
        // If the label is currently selected, then unselect it, otherwise select it.
        this.allLabels.forEach(nextLabel => {
            if (nextLabel.id === id) {
                if (nextLabel.selected) {
                    this._backupDisplayService.removeFileLabel(this.selectedFile.file.id, id);
                    console.log('🗑️ Remove label');
                } else {
                    this._backupDisplayService.setFileLabel(this.selectedFile.file.id, id);
                    console.log('➕ Add label');
                }
            }
        });
        this.modalService.hide();
        console.log('🏷️ Label ID:', id);
    }
}
