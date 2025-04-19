import {Component, Input} from "@angular/core";
import {HierarchyResponse} from "../../../backup-hierarchyresponse";

@Component({
    selector: 'jbr-backup-file-data-md5',
    templateUrl: './backup-file-data-md5.html',
    styleUrls: ['./backup-file-data.css'],
    standalone: true,
    imports: []
})
export class BackupFileDataMd5 {
    @Input() file: HierarchyResponse;
}
