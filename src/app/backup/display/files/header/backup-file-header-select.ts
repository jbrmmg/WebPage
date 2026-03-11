import {Component, Input} from '@angular/core';
import {HierarchyResponse} from '../../../backup-hierarchyresponse';

@Component({
    selector: 'jbr-backup-file-header-select',
    templateUrl: './backup-file-header-select.html',
    styleUrls: ['./backup-file-header.css'],
    standalone: true,
    imports: []
})
export class BackupFileHeaderSelect {
    @Input() file: HierarchyResponse;
}
