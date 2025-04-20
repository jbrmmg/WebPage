import {Component} from "@angular/core";
import {DecimalPipe} from "@angular/common";
import {BackupFileData} from "./backup-file-data";

@Component({
    selector: 'jbr-backup-file-data-size',
    templateUrl: './backup-file-data-size.html',
    styleUrls: ['./backup-file-data.css'],
    standalone: true,
    imports: [
        DecimalPipe
    ]
})
export class BackupFileDataSize extends BackupFileData {
}
