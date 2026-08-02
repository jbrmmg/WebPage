import {Component, Input} from '@angular/core';
import {BackupSource} from '../../backup-source';
import {BackupSummary} from '../../backup-summary';

@Component({
    selector: '',
    template: '',
    standalone: true,
    styles: []
})
export abstract class SummaryGridData {
    @Input() source: BackupSource;
    @Input() summary: BackupSummary;

    abstract getText(): string;

    statusClass() {
        switch (this.source?.status) {
            case 'OK':        return 'ok';
            case 'GATHERING': return 'gathering';
            case 'SUSPENDED': return 'suspended';
            case 'ERROR':     return 'bad';
            default:          return 'bad';
        }
    }
}
