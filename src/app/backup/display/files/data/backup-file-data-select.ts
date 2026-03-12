import {Component, Input} from '@angular/core';
import {FileInfoExtra} from '../../../backup-fileinfoextra';
import {BackupFileData} from './backup-file-data';

@Component({
    selector: 'jbr-backup-file-data-select',
    templateUrl: './backup-file-data-select.html',
    styleUrls: ['./backup-file-data.css'],
    standalone: true,
    imports: []
})
export class BackupFileDataSelect extends BackupFileData {
    @Input() selectedFile: FileInfoExtra;

    isSelected(): boolean {
        return this.file != null && this.selectedFile?.file?.id === this.file.id;
    }

    getSelected(): string {
        return this.isSelected() ? 'selected' : 'not-selected';
    }
}
