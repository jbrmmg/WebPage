import {Component, Input} from "@angular/core";
import {HierarchyResponse} from "../../../backup-hierarchyresponse";

@Component({
    selector: 'jbr-backup-file-header-date',
    templateUrl: './backup-file-header-date.html',
    styleUrls: ['./backup-file-header.css'],
    standalone: true,
    imports: []
})
export class BackupFileHeaderDate {
    @Input() file: HierarchyResponse;
}
