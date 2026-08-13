import {Component, Input, OnInit} from '@angular/core';
import {FileInfoExtra} from '../../backup-fileinfoextra';
import {Label} from '../../backup-label';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {BackupDisplayService} from '../backup-display-service';

@Component({
    selector: 'jbr-backup-display-labels',
    templateUrl: './backup-display-label.component.html',
    styleUrls: ['./backup-display-label.component.css'],
    standalone: true,
    imports: [
        NgClass,
        NgForOf,
        NgIf
    ]
})
export class BackupDisplayLabelComponent implements OnInit {
    @Input() selectedFile: FileInfoExtra;

    allLabels: Label[] = [];

    constructor(private readonly _backupDisplayService: BackupDisplayService) {}

    ngOnInit(): void {
        this._backupDisplayService.getLabels().subscribe(labels => {
            this.allLabels = labels;
        });
    }

    isAssigned(label: Label): boolean {
        return this.selectedFile?.labels?.includes(label.name) ?? false;
    }

    toggle(label: Label): void {
        if (this.selectedFile == null) return;
        if (this.isAssigned(label)) {
            this._backupDisplayService.removeFileLabel(this.selectedFile.file.id, label.id);
        } else {
            this._backupDisplayService.setFileLabel(this.selectedFile.file.id, label.id);
        }
    }
}
