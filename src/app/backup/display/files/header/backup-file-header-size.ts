import {Component, Input} from '@angular/core';
import {HierarchyResponse} from '../../../backup-hierarchyresponse';

@Component({
    selector: 'jbr-backup-file-header-size',
    templateUrl: './backup-file-header-size.html',
    styleUrls: ['./backup-file-header.css'],
    standalone: true,
    imports: []
})
export class BackupFileHeaderSize {
    @Input() file: HierarchyResponse;
}
