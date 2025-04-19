import {Component} from "@angular/core";
import {BackupFileData} from "./backup-file-data";

@Component({
    selector: 'jbr-backup-file-data-md5',
    templateUrl: './backup-file-data-md5.html',
    styleUrls: ['./backup-file-data.css'],
    standalone: true,
    imports: []
})
export class BackupFileDataMd5 extends BackupFileData {
}
