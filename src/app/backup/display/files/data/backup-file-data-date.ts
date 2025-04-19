import {Component} from "@angular/core";
import {BackupFileData} from "./backup-file-data";

@Component({
    selector: 'jbr-backup-file-data-date',
    templateUrl: './backup-file-data-date.html',
    styleUrls: ['./backup-file-data.css'],
    standalone: true,
    imports: []
})
export class BackupFileDataDate extends BackupFileData {
    getFileDateTime(): string {
        if(this.file && this.file.dateTime) {
            return this.file.dateTime.toString().replace("T", " ");
        }

        return null;
    }
}
