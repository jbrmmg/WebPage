import {Component, Input} from "@angular/core";
import {HierarchyResponse} from "../../../backup-hierarchyresponse";

@Component({
    selector: 'jbr-backup-file-data-date',
    templateUrl: './backup-file-data-date.html',
    styleUrls: ['./backup-file-data.css'],
    standalone: true,
    imports: []
})
export class BackupFileDataDate {
    @Input() file: HierarchyResponse;

    getFileDateTime(): string {
        if(this.file && this.file.dateTime) {
            return this.file.dateTime.toString().replace("T", " ");
        }

        return null;
    }
}
