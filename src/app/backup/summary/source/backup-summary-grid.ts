import {Component, OnInit} from "@angular/core";
import {SummaryGridHeaderPath} from "./header/summary-grid-header-path";
import {SummaryGridHeaderStatus} from "./header/summary-grid-header-status";
import {SummaryGridDataStatus} from "./data/summary-grid-data-status";
import {SummaryGridDataPath} from "./data/summary-grid-data-path";
import {BackupSummaryService} from "../backup-summary-service";
import {BackupSummary} from "../backup-summary";
import {NgForOf, NgIf} from "@angular/common";
import {SummaryGridHeaderLocation} from "./header/summary-grid-header-location";
import {SummaryGridHeaderFiles} from "./header/summary-grid-header-files";
import {SummaryGridHeaderDirectories} from "./header/summary-grid-header-directories";
import {SummaryGridHeaderLargest} from "./header/summary-grid-header-largest";
import {SummaryGridHeaderDestination} from "./header/summary-grid-header-destination";
import {SummaryGridDataLocation} from "./data/summary-grid-data-location";
import {SummaryGridDataFiles} from "./data/summary-grid-data-files";
import {SummaryGridDataDirectories} from "./data/summary-grid-data-directories";
import {SummaryGridDataLargest} from "./data/summary-grid-data-largest";
import {SummaryGridDataDestination} from "./data/summary-grid-data-destination";

@Component({
    selector: 'jbr-summary-grid',
    templateUrl: './backup-summary-grid.html',
    styleUrls: ['./backup-summary-grid.css'],
    imports: [
        SummaryGridHeaderPath,
        SummaryGridHeaderStatus,
        SummaryGridHeaderFiles,
        SummaryGridHeaderLocation,
        SummaryGridHeaderDirectories,
        SummaryGridHeaderLargest,
        SummaryGridHeaderDestination,
        SummaryGridDataStatus,
        SummaryGridDataFiles,
        SummaryGridDataPath,
        SummaryGridDataLocation,
        SummaryGridDataDirectories,
        SummaryGridDataDestination,
        SummaryGridDataLargest,
        NgIf,
        NgForOf
    ],
    standalone: true
})
export class BackupSummaryGrid implements OnInit {
    summary: BackupSummary;

    constructor(private readonly _backupSummaryService: BackupSummaryService) {
    }

    ngOnInit(): void {
        this._backupSummaryService.getSummary().subscribe({
            next: val => {
                this.summary = val;
            },
            error: err => {
                // Error
                console.log(err);
            },
            complete: () => {
                // Sort the list.
                this.summary.sources.sort(function (a, b): number {
                    if(a.fileCount != b.fileCount) {
                        if(a.fileCount < b.fileCount) {
                            return 1;
                        }

                        return -1;
                    }

                    if(a.location.name != b.location.name) {
                        if(a.location.name > b.location.name) {
                            return 1;
                        }

                        return -1;
                    }

                    if(a.path > b.path) {
                        return 1;
                    }

                    if(a.path < b.path){
                        return -1;
                    }

                    return -1;
                });
            }
        });
    }
}
