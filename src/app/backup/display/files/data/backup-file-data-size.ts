import {Component, Input} from "@angular/core";
import {HierarchyResponse} from "../../../backup-hierarchyresponse";
import {DecimalPipe} from "@angular/common";

@Component({
    selector: 'jbr-backup-file-data-size',
    templateUrl: './backup-file-data-size.html',
    styleUrls: ['./backup-file-data.css'],
    standalone: true,
    imports: [
        DecimalPipe
    ]
})
export class BackupFileDataSize {
    @Input() file: HierarchyResponse;
}
