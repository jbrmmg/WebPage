import {Component, OnInit} from "@angular/core";
import {FileInfo} from "../../backup-fileinfo";

@Component({
    selector: 'jbr-backup-display-backups',
    templateUrl: './backups-list.component.html',
    styleUrls: ['./backups-list.component.css']
})
export class BackupDisplayBackupsComponent implements OnInit {
    fileBackups: FileInfo[];

    ngOnInit(): void {
    }
}
