import {Component, Input, OnInit} from "@angular/core";
import {NgForOf, NgIf} from "@angular/common";
import {BackupFileHeaderName} from "./header/backup-file-header-name";
import {BackupFileDataName} from "./data/backup-file-data-name";
import {HierarchyResponse} from "../../backup-hierarchyresponse";
import {BackupFileHeaderSelect} from "./header/backup-file-header-select";
import {BackupFileHeaderDate} from "./header/backup-file-header-date";
import {BackupFileHeaderSize} from "./header/backup-file-header-size";
import {BackupFileHeaderMd5} from "./header/backup-file-header-md5";
import {BackupFileDataSelect} from "./data/backup-file-data-select";
import {BackupFileDataDate} from "./data/backup-file-data-date";
import {BackupFileDataSize} from "./data/backup-file-data-size";
import {BackupFileDataMd5} from "./data/backup-file-data-md5";

@Component({
    selector: 'jbr-backup-display-files',
    templateUrl: './backup-display-files.html',
    styleUrls: ['./backup-display-files.css'],
    standalone: true,
    imports: [
        NgForOf,
        NgIf,
        BackupFileHeaderName,
        BackupFileDataName,
        BackupFileHeaderSelect,
        BackupFileHeaderDate,
        BackupFileHeaderSize,
        BackupFileHeaderMd5,
        BackupFileDataSelect,
        BackupFileDataDate,
        BackupFileDataSize,
        BackupFileDataMd5,
    ]
})
export class BackupDisplayFiles implements OnInit {
    @Input() hierarchy: HierarchyResponse[];

    ngOnInit(): void {
    }

    displayFiles(): boolean {
        if(this.hierarchy && this.hierarchy.length) {
            let result: boolean = false;

            this.hierarchy.forEach(h => {
                if(!h.directory && !h.backup) {
                    result = true;
                    return;
                }
            });

            return result;
        }

        return false;
    }

    getFileList(): HierarchyResponse[] {
        let result: HierarchyResponse[] = [];

        if(this.hierarchy && this.hierarchy.length) {
            this.hierarchy.forEach(h => {
                if(!h.directory && !h.backup) {
                    result.push(h);
                }
            });
        }

        return result;
    }
}
