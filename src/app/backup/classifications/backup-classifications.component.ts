import {Component, OnInit} from '@angular/core';
import {BackupClassification} from './backup-classification';
import {BackupClassificationsService} from './backup-classifications.service';

@Component({
    selector: 'jbr-backup-classifications',
    templateUrl: './backup-classifications.component.html',
    styleUrls: ['./backup-classifications.component.css']
})
export class BackupClassificationsComponent implements OnInit {
    classifications: BackupClassification[] = [];
    error = false;

    constructor(private readonly _service: BackupClassificationsService) {}

    ngOnInit(): void {
        this._service.getClassifications().subscribe({
            next: data => { this.classifications = data; },
            error: () => { this.error = true; }
        });
    }

    actionLabel(action: string): string {
        switch (action) {
            case 'CA_BACKUP': return 'Backup';
            case 'CA_DELETE': return 'Delete';
            case 'CA_WARN':   return 'Warn';
            case 'CA_IGNORE': return 'Ignore';
            default:          return action;
        }
    }

    actionClass(action: string): string {
        switch (action) {
            case 'CA_BACKUP': return 'action-backup';
            case 'CA_DELETE': return 'action-delete';
            case 'CA_WARN':   return 'action-warn';
            case 'CA_IGNORE': return 'action-ignore';
            default:          return '';
        }
    }
}
