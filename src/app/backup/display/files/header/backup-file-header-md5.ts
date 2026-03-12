import {Component, Input} from '@angular/core';
import {HierarchyResponse} from '../../../backup-hierarchyresponse';

@Component({
    selector: 'jbr-backup-file-header-md5',
    templateUrl: './backup-file-header-md5.html',
    styleUrls: ['./backup-file-header.css'],
    standalone: true,
    imports: []
})
export class BackupFileHeaderMd5 {
    @Input() file: HierarchyResponse;
}
