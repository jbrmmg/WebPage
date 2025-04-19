import {Component} from "@angular/core";
import {BackupFileData} from "./backup-file-data";

@Component({
    selector: 'jbr-backup-file-data-name',
    templateUrl: './backup-file-data-name.html',
    styleUrls: ['./backup-file-data.css'],
    standalone: true,
    imports: []
})
export class BackupFileDataName extends BackupFileData {
}
