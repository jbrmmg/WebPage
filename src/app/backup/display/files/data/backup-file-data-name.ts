import {Component, Input} from "@angular/core";
import {HierarchyResponse} from "../../../backup-hierarchyresponse";

@Component({
    selector: 'jbr-backup-file-data-name',
    templateUrl: './backup-file-data-name.html',
    styleUrls: ['./backup-file-data.css'],
    standalone: true,
    imports: []
})
export class BackupFileDataName {
    @Input() file: HierarchyResponse;
}
