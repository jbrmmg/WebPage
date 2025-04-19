import {Component, Input} from "@angular/core";
import {HierarchyResponse} from "../../../backup-hierarchyresponse";

@Component({
    selector: 'jbr-backup-file-data-select',
    templateUrl: './backup-file-data-select.html',
    styleUrls: ['./backup-file-data.css'],
    standalone: true,
    imports: []
})
export class BackupFileDataSelect {
    @Input() file: HierarchyResponse;
}
